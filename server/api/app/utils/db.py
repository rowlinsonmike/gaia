import boto3
from boto3.dynamodb.conditions import Key,Contains
from boto3.dynamodb.types import TypeDeserializer
deserializer = TypeDeserializer()
from os import environ
import decimal
import json
import traceback
from boto3.dynamodb.conditions import Key, Attr

# https://www.trek10.com/blog/dynamodb-single-table-relational-modeling/


# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        if isinstance(o, set):  #<---resolving sets as lists
            return list(o)
        return super(DecimalEncoder, self).default(o)


def deserialize(values):
    d = lambda x: {k: deserializer.deserialize(v) for k, v in x.items()}
    return [d(v) for v in values]

TABLE_TEMPLATE = {
    'KeySchema':[
            {
                'AttributeName': 'pk',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'sk',
                'KeyType': 'RANGE'
            },
    ],
    'AttributeDefinitions':[
            {
                'AttributeName': 'pk',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'sk',
                'AttributeType': 'S'
            },
            {
            'AttributeName': 'data',
            'AttributeType': 'S'
            }
    ],
    'GlobalSecondaryIndexes':[
        {
            'IndexName': 'gsi_1',
            'KeySchema': [
                    {
                        'AttributeName': 'sk',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'data',
                        'KeyType': 'RANGE'
                    },
            ],
            'Projection': {
                'ProjectionType': 'ALL'
            }
        },
    ],
    'BillingMode':'PAY_PER_REQUEST'
}

class DynamoTable(object):
    def __init__(self,app):
        db = environ.get("DYNAMO")
        self.client = boto3.client('dynamodb',endpoint_url=f'http://{db}:8000')
        self._table = 'gaia'
        self.resource = boto3.resource('dynamodb',endpoint_url=f'http://{db}:8000').Table(self._table)
        ...
    def create_table(self):
        if not self.table_exists():
            self.client.create_table(TableName=self._table,**TABLE_TEMPLATE)
    def delete_table(self):
        if self.table_exists():
            self.client.delete_table(TableName=self._table)
    def table_exists(self):
        try:
            self.client.describe_table(TableName=self._table)
            return True
        except:
            return False

    def load(self,key,**kwargs):
        elements = key.split(":")
        if len(elements) < 3:
            pk,sk = key.split(":")
            resp = self.resource.put_item(
                Item={
                    'pk':pk,
                    'sk': sk,
                    **kwargs
                }
            )
        else:
            pk,sk,data = elements
            resp = self.resource.put_item(
                Item={
                    'pk':pk,
                    'sk': sk,
                    'data':data,
                    **kwargs
                }
            )
    def update(self,key,**kwargs):
        pk,sk = key.split(":")
        updates = {k: {'Value': v,'Action': 'PUT'} for k,v in kwargs.items()}
        self.resource.update_item(
                Key={'pk': pk,'sk':sk},
                AttributeUpdates=updates
        )
    def delete(self,key):
        try:
            pk,sk = key.split(":")
            resp = self.resource.delete_item(Key={'pk': pk, 'sk': sk})
        except Exception as e: 
            ...
    def query(self,key):
        #gsi_1 index
        if key[0] == ":":
            elements = key.split(":")
            if len(elements) == 2:
                #no data key
                resp = self.resource.query(IndexName='gsi_1',KeyConditionExpression=Key('sk').eq(elements[1]))
            else:
                resp = self.resource.query(IndexName='gsi_1',KeyConditionExpression=Key('sk').eq(elements[1]) & Key('data').eq(elements[2]))
        #primary index
        else:
            elements = key.split(":")
            if len(elements) == 1:
                #no data key
                resp = self.resource.query(KeyConditionExpression=Key('pk').eq(elements[0]))
            else:
                resp = self.resource.query(KeyConditionExpression=Key('pk').eq(elements[0]) & Key('sk').eq(elements[1]))
        resp = json.loads(json.dumps((resp), indent=4, cls=DecimalEncoder))
        return resp['Items']
    def batch_get(self,keys):
        keys = [{'pk':{"S":p},'sk':{"S":s}} for p,s in keys ]
        try:
            table = self._table
            resources = self.client.batch_get_item(
                RequestItems={
                    table: {
                        'Keys': keys,
                    }
                }
            )["Responses"][table]
            return deserialize(resources)
        except:
            traceback.print_exc()
            return []
    def delete_many(self,items):
        deletes = []
        for item in items:
            deletes.append({"DeleteRequest":{"Key":{"pk":{"S":item["pk"]},'sk':{"S":item["sk"]}}}})
        for item in items:
            self.client.batch_write_item(RequestItems={self._table:deletes})
class Dynamo(object):
    def __init__(self,app=None):
        """
        Initialize this extension.
        :param obj app: The Flask application (optional).
        """
        self.app = app
        if app is not None:
            self.init_app(app)
    def init_app(self, app):
        """
        Initialize this extension.
        :param obj app: The Flask application.
        """
        self._init_settings(app)
        app.extensions['dynamo'] = self
        self.table = DynamoTable(app)
    @staticmethod
    def _init_settings(app):
        """Initialize all of the extension settings."""
        app.config.setdefault('DYNAMO_USER_TABLE', app.config.get("DYNAMO_USER_TABLE"))
        app.config.setdefault('DYNAMO_ENABLE_LOCAL', app.config.get("DYNAMO_ENABLE_LOCAL"))
        app.config.setdefault('AWS_REGION', app.config.get("AWS_REGION",'us-east-1'))



# conn = DynamoST(Table="Testing")

# conn.load("my nox group:enabled:123123123#us-east-1")
# print(conn.load('my nox group:GROUP:enabled'))
# print(conn.load('i-12123123:INSTANCE:my nox group'))
# print(conn.load('i-11111113:INSTANCE:my test group#started'))
# print(conn.load('mike:USER:admin'))
# print(conn.query('my nox group'))
# print(conn.query(':INSTANCE:my nox group'))

# group groupId "GROUP" 
# instance instanceId "INSTANCE" groupId
# instanceId, name, cost, state
# user userId "USER" createDate
# name, type


import boto3
import os
from boto3.dynamodb.conditions import Key


class db():
    def __init__(self):
        db = os.environ.get("DYNAMO")
        self.db = boto3.resource('dynamodb',endpoint_url=f'http://{db}:8000').Table('gaia')
    def post_doc(self,pk,sk,**kwargs):
        self.db.put_item(Item={"pk":pk,"sk":sk,"data":pk,**kwargs})
    def put_doc(self,pk,sk,**kwargs):
        updates = {k: {'Value': v,'Action': 'PUT'} for k,v in kwargs.items()}
        self.db.update_item(Key={'pk': pk,'sk':sk},AttributeUpdates=updates)
    def del_doc(self,pk,sk):
        self.db.delete_item(Key={'pk': pk, 'sk': sk})
    def get_doc(self,pk,sk):
        try:
            return self.db.query(KeyConditionExpression=Key('pk').eq(pk) & Key('sk').eq(sk))["Items"][0]
        except:
            return None
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from bson import ObjectId

router = APIRouter(prefix="/api")


@router.get("/health")
async def health():
    return {"status": "ok"}


def _obj_id_to_str(doc):
    if not doc:
        return doc
    doc = dict(doc)
    _id = doc.get("_id")
    if _id is not None:
        doc["_id"] = str(_id)
    return doc


@router.get("/items")
async def list_items(request: Request):
    db = request.app.state.db
    cursor = db["items"].find()
    items = await cursor.to_list(length=100)
    items = [_obj_id_to_str(i) for i in items]
    return items


@router.post("/items")
async def create_item(request: Request):
    payload = await request.json()
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="JSON body must be an object")
    db = request.app.state.db
    result = await db["items"].insert_one(payload)
    payload["_id"] = str(result.inserted_id)
    return JSONResponse(status_code=201, content=payload)

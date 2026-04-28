"""Cursor pagination shared by /api/recipes and /api/ingredients.

The cursor is opaque to clients: a base64url-encoded JSON object containing
the id of the last visible row of the previous page. Encoding it (rather
than exposing the raw integer) prevents clients from "fixing" off-by-one
mistakes by hand-adjusting the cursor value.
"""
from __future__ import annotations

import base64
import json

from sqlalchemy import Column
from sqlalchemy.sql import Select


def encode_cursor(after_id: int) -> str:
    payload = json.dumps({"after_id": after_id}, separators=(",", ":")).encode("utf-8")
    return base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")


def decode_cursor(token: str) -> int:
    padding = "=" * (-len(token) % 4)
    payload = base64.urlsafe_b64decode(token + padding)
    data = json.loads(payload.decode("utf-8"))
    return int(data["after_id"])


def apply_cursor(stmt: Select, id_col: Column, cursor: str | None) -> Select:
    """Apply the cursor predicate to `stmt`.

    BUG: the predicate is `id >= after_id` instead of `id > after_id`. The
    previous page returned `next_cursor` encoding the id of its last visible
    row; with `>=`, that row reappears as the first item of the next page.
    Fixing this single function fixes pagination on both /recipes and
    /ingredients.
    """
    if cursor is None:
        return stmt
    after_id = decode_cursor(cursor)
    return stmt.where(id_col >= after_id)

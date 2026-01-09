"""
Registry for Robot instances.
"""
from typing import List, Optional, Any
import threading

from .Robot import Robot

_lock = threading.Lock()
_robots: List[Robot] = []

def add(id: int) -> bool:
  """Add a Robot instance to the registry."""
  with _lock:
    if find_by_id(id) is not None:
      print(f"Robot with id {id} already exists in registry.")
      return False  # already exists
    else:
      _robots.append(Robot(id))
      print(f"Added Robot with id {id} to registry.")
      return True

def remove(id: int):
  """Remove a Robot instance if present."""
  with _lock:
    try:
      robot = find_by_id(id)
      _robots.remove(robot)
      print(f"Removed Robot with id {id} from registry.")
    except ValueError:
      print(f"Robot with id {id} not found in registry.")
      pass

def list_all() -> List[Robot]:
  """Return a shallow copy of registered Robot instances."""
  with _lock:
    return list(_robots)

def find_by_id(id: int) -> Optional[Robot]:
  """Find first Robot where robot.id == id.

  Returns None if not found.
  """
  with _lock:
    for r in _robots:
      if r.get_id() == id:
        return r
  return None

def clear():
  """Remove all registered Robot instances."""
  with _lock:
    _robots.clear()
    print("Cleared all Robots from registry.")

__all__ = ["add", "remove", "list_all", "find_by_id", "clear"]
<<<<<<< HEAD
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, DateTime,Date,ForeignKey,Boolean,Enum,Table,JSON
from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError
from core.config import cfg

if cfg.get("db","mysql").startswith("mysql"):
    from sqlalchemy.dialects.mysql import MEDIUMTEXT as Text
else:
    from sqlalchemy import Text

class DataStatus():
    DELETED:int = 1000
    ACTIVE:int = 1
    INACTIVE:int = 2
    PENDING:int = 3
    COMPLETED:int = 4
    FAILED:int = 5
    FETCHING:int = 6  # 正在获取内容（锁定状态，防止多节点重复获取）
DATA_STATUS=DataStatus()
=======
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, DateTime,Date,ForeignKey,Boolean,Enum,Table,JSON
from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError
from core.config import cfg

if cfg.get("db","mysql").startswith("mysql"):
    from sqlalchemy.dialects.mysql import MEDIUMTEXT as Text
else:
    from sqlalchemy import Text

class DataStatus():
    DELETED:int = 1000
    ACTIVE:int = 1
    INACTIVE:int = 2
    PENDING:int = 3
    COMPLETED:int = 4
    FAILED:int = 5
    FETCHING:int = 6  # 正在获取内容（锁定状态，防止多节点重复获取）
DATA_STATUS=DataStatus()
>>>>>>> cf8b407bc0234127992336de96980c6c65f8f72b
Base = declarative_base()
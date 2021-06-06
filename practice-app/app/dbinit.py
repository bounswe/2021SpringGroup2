from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, BigInteger, Boolean, MetaData, Date, Time, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.dialects.postgresql import ENUM, NUMRANGE, INT4RANGE, ARRAY
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.orm import sessionmaker

db = create_engine('postgresql://practice_user:-#My6o0dPa33W0rd#-@localhost:5432/practiceapp_db')
base = declarative_base()

class User(base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True)
    nickname = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    biography = Column(String)
    birth_year = Column(Integer)
    avatar = Column(String)
    location = Column(String)
    fav_sport_1 = Column(String)
    fav_sport_2 = Column(String)
    fav_sport_3 = Column(String)
    badge_1 = Column(String)
    badge_2 = Column(String)
    badge_3 = Column(String)
    privacy = Column(Boolean)

class Post(base):
    __abstract__ = True
    __tablename__ = "post"
    postID = Column(BigInteger,primary_key=True)
    @declared_attr
    def ownerID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False)
    content = Column(Text)
    title = Column(String(100),nullable=False)
    creationDate = Column(DateTime,nullable=False)
    location = Column(String(200))

class Eventpost(Post):
    __tablename__ = "eventpost"
    eventDate = Column(Date,nullable=False)
    eventHours = Column(Time,nullable=False)
    eventSport = Column(String(30),nullable=False)
    eventAgeGroup = Column(INT4RANGE)
    eventPlayerCapacity = Column(Integer,nullable=False)
    eventSpectatorCapacity = Column(Integer)
    eventPlayers = Column(ARRAY(Integer))
    eventSpectators = Column(ARRAY(Integer))
    eventSkillLevel = Column(ENUM('Beginner', 'Preintermediate', 'Intermediate','Advanced','Expert', name='skill'))
    eventLatitude =  Column(Float)
    eventLongitude = Column(Float)
    
class Equipmentpost(Post):
    __tablename__ = "equipmentpost"
    equipmentType = Column(String(30), nullable=False)
    websiteName = Column(String(50), nullable=False)
    link = Column(String(200), nullable=False)    
    
class Notification(base):
    __tablename__ = "notification"
    ID = Column(BigInteger, primary_key=True)
    date = Column(Date,nullable=False)
    description = Column(String,nullable=False)
    isRead = Column(Boolean,nullable=False)
    @declared_attr
    def recipientID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False)

class Following(base):
    __tablename__ = "Following"

    @declared_attr
    def followingID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False, primary_key=True)

    @declared_attr
    def followerID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False, primary_key=True)
    
class Blocking(base):
    __tablename__ = "blocking"

    @declared_attr
    def blockingID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False, primary_key=True)

    @declared_attr
    def blockedID(cls):
        return Column(BigInteger, ForeignKey("users.user_id"), nullable=False, primary_key=True)

class Comment(base):
    __tablename__ = "comments"
    commentId = Column(BigInteger, primary_key=True)
    commentDate = Column(Date,nullable=False)
    comment = Column(String(300),nullable=False)

    @declared_attr
    def postID(cls):
        return Column(BigInteger,ForeignKey("eventpost.postID"),nullable=False)

    @declared_attr
    def ownerID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False)

class Answer(base):
    __tablename__ = "answers"
    answerId = Column(BigInteger, primary_key=True)
    answerDate = Column(Date,nullable=False)
    answer = Column(String(300),nullable=False)

    @declared_attr
    def ownerID(cls):
        return Column(BigInteger,ForeignKey("users.user_id"),nullable=False)

    @declared_attr
    def commentId(cls):
        return Column(BigInteger,ForeignKey("eventpost.postID"),nullable=False)

    
Session = sessionmaker(db)
session = Session()

base.metadata.create_all(db)

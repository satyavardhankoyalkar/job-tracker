from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User
from schemas import UserCreate, UserResponse
from security import hash_password
from security import verify_password, create_access_token
from schemas import UserLogin, Token
from auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Backend running successfully 🚀"}


@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    hashed_pw = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        return {"error": "Invalid credentials"}

    if not verify_password(form_data.password, db_user.hashed_password):
        return {"error": "Invalid credentials"}

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }



@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }


from models import Application
from schemas import ApplicationCreate, ApplicationResponse


@app.post("/applications", response_model=ApplicationResponse)
def create_application(
    app: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_app = Application(
        company=app.company,
        status=app.status,
        notes=app.notes,
        user_id=current_user.id
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return new_app


@app.get("/applications", response_model=list[ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    apps = db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()

    return apps

@app.put("/applications/{app_id}")
def update_application(
    app_id: int,
    app: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        return {"error": "Application not found"}

    application.company = app.company
    application.status = app.status
    application.notes = app.notes

    db.commit()
    db.refresh(application)

    return application

@app.delete("/applications/{app_id}")
def delete_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        return {"error": "Application not found"}

    db.delete(application)
    db.commit()

    return {"message": "Application deleted"}

![3d4c](https://github.com/user-attachments/assets/cba543e8-6a75-4472-8ebc-56ee4be594ff)

# 🎮 Connect4-3D Edition  
Welcome to the **Connect4-3D Edition** repository! This project brings the classic Connect4 game into the third dimension, complete with a computer opponent. 🚀  

## 🛠️ Setup  
This repository combines both the **frontend** and **backend**. Follow the steps below to get everything up and running!  

### 🌐 Frontend  
1. Navigate to the `frontend` folder:  
   ```bash
   cd frontend
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the development server:  
   ```bash
   npm run start
   ```  
4. Access the web app at [http://localhost:3000](http://localhost:3000). 🎉  

### 🖥️ Backend  
The backend is powered by **Python FastAPI**. Follow these steps to set it up:  

1. Navigate to the `backend` folder:  
   ```bash
   cd backend
   ```  
2. Create and activate a virtual environment:  
   ```bash
   virtualenv -p 3.10 .venv
   source .venv/bin/activate
   ```  
3. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```  
4. Install the pre-commit hook (optional but recommended):  
   ```bash
   pre-commit install
   ```  
5. Start the development server:  
   ```bash
   uvicorn app:app --reload
   ```  
6. Access the API at [http://localhost:8080](http://localhost:8080). 🌟  

## 📝 Notes  
- **Git Commands**: Use git commands only within the virtual environment shell to ensure `pytest` works correctly.  
- **Python Scripts**: Run Python scripts without the `.py` extension:  
  ```bash
  python -m src.your_script
  ```  

## 🤝 Contributions  
We welcome contributions from the community! Whether it's fixing bugs, adding features, or improving documentation, your help is appreciated.  

### How to Contribute  
1. Clone the repository.  
2. Create a new branch for your feature or fix.  
3. Submit a pull request with a clear description of your changes.  

Feel free to reach out if you have any questions or ideas! You can open an issue or contact us directly. Let's make this project even better together! 💪  

## 📧 Contact  
Have questions or feedback? Reach out via GitHub Issues or email us directly. We'd love to hear from you!  

---
Happy coding! 🎉

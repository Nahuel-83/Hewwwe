# 🌟 Hewwwe - Modern E-commerce Platform

## 📋 Overview
Hewwwe is a robust, full-stack e-commerce application that empowers users to buy, sell, and exchange products in a secure and intuitive environment. Built with modern technologies, the application combines a responsive React frontend with a powerful Spring Boot backend, connected via RESTful APIs and seamlessly deployed with Docker for maximum portability and scalability.

## 🏗️ Architecture
The project implements a clean microservices architecture designed for scalability and maintainability:

- **Frontend**: 🖥️ Modern React application leveraging TypeScript for type safety and Material UI for a polished user interface
- **Backend**: ⚙️ Robust Spring Boot API providing secure endpoints and business logic
- **Database**: 💾 MySQL database optimized for e-commerce data requirements
- **Deployment**: 🐳 Docker containers orchestrated with Docker Compose for consistent environments

## ✨ Key Features

- 🔐 **User Authentication & Authorization**
  - Secure login and registration
  - JWT-based authentication
  - Role-based access control (User/Admin)

- 🛍️ **Product Management**
  - Comprehensive product listings with search and filtering
  - Category-based organization
  - Image uploads and management
  - Detailed product descriptions

- 🛒 **Shopping Experience**
  - Intuitive shopping cart functionality
  - Streamlined checkout process
  - Order history and tracking

- 🔄 **Exchange System**
  - Innovative product exchange requests
  - Negotiation capabilities between users
  - Status tracking for exchanges

- 📝 **Order Processing**
  - Automated invoice generation
  - Payment processing integration
  - Order status updates

- 👤 **User Profile Management**
  - Multiple address management
  - Profile information updates
  - Activity history

- 🛡️ **Admin Dashboard**
  - Comprehensive system monitoring
  - User management capabilities
  - Product and category administration

## 🛠️ Technologies Used

### Frontend
- ⚛️ **React 18** - Latest features of the popular UI library
- 📘 **TypeScript** - Enhanced developer experience with static typing
- 🎨 **Material UI 7** - Polished and responsive UI components
- 🧭 **React Router** - Seamless navigation and routing
- 🔄 **Axios** - Efficient API communication
- ⚡ **Vite** - Next-generation frontend build tooling

### Backend
- ☕ **Java 21** - Latest Java features and optimizations
- 🍃 **Spring Boot 3.4** - Rapid application development
- 🔒 **Spring Security** - Comprehensive security framework
- 🗃️ **Spring Data JPA** - Simplified data access layer
- 🐬 **MySQL** - Reliable relational database
- 🏗️ **Lombok** - Reduced boilerplate code
- 📚 **OpenAPI/Swagger** - Automated API documentation
- 🔄 **Model Mapper** - Simplified object mapping

### DevOps
- 🐳 **Docker & Docker Compose** - Containerization and orchestration
- 🌐 **Nginx** - High-performance web server for frontend serving

## 🚀 Running the Application with Docker

### Prerequisites
- 🐳 Docker and Docker Compose installed on your system
- 📦 Git (to clone the repository)
- 💡 Basic knowledge of command-line interfaces

### Step-by-Step Guide

1. **Clone the Repository** 📥
   ```bash
   git clone https://github.com/yourusername/hewwwe.git
   cd hewwwe
   ```

2. **Start the Application** 🚀
   ```bash
   docker-compose up -d
   ```
   This powerful command will:
   - Build the frontend and backend containers with optimized settings
   - Initialize and start the MySQL database with proper configurations
   - Set up secure networking between all services
   - Make the application accessible on your local machine

3. **Access the Application** 🌐
   - 🖥️ **Frontend**: http://localhost:80
   - ⚙️ **Backend API**: http://localhost:8080
   - 📚 **API Documentation**: http://localhost:8080/swagger-ui.html

4. **Monitor the Application** 📊
   ```bash
   docker-compose logs -f
   ```

5. **Stop the Application** ⏹️
   ```bash
   docker-compose down
   ```

6. **Clean Up Everything** 🧹
   To stop the application and remove volumes (will delete all database data):
   ```bash
   docker-compose down -v
   ```

## 📚 API Documentation
The backend API is thoroughly documented using OpenAPI/Swagger. Once the application is running, you can explore the interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

This documentation provides:
- 📝 Detailed endpoint descriptions
- 🧪 Interactive API testing capabilities
- 📋 Request and response schema information
- 🔒 Authentication requirements

## 💻 Development Environment Setup

### Frontend Development
To run the frontend in development mode with hot-reloading:

```bash
# Navigate to frontend directory
cd front/hewwwe

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will be available at `http://localhost:5173` with:
- ⚡ Hot module replacement
- 🔄 Fast refresh
- 🐛 Error overlay
- 🔍 Source maps

### Backend Development
To run the backend in development mode:

```bash
# Navigate to backend directory
cd back/Hewwwe

# Start Spring Boot application
./mvnw spring-boot:run
```

The development server will:
- 🔄 Auto-reload on code changes
- 📝 Display detailed logs
- 🔌 Connect to the database specified in application.properties

## 📂 Project Structure

### Frontend Structure
```
front/hewwwe/
├── public/                # Static files and assets
├── src/
│   ├── api/               # API integration services
│   │   ├── axios.ts       # Axios instance and interceptors
│   │   ├── products.ts    # Product-related API calls
│   │   ├── auth.ts        # Authentication API services
│   │   └── ...            # Other API modules
│   ├── assets/            # Images, icons and resources
│   ├── components/        # Reusable UI components
│   │   ├── ProductCard.tsx  # Product display component
│   │   ├── Navbar.tsx     # Navigation component
│   │   └── ...            # Other components
│   ├── contexts/          # React context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ...            # Other contexts
│   ├── layouts/           # Page layout templates
│   ├── pages/             # Application views/pages
│   │   ├── HomePage.tsx   # Main landing page
│   │   ├── products/      # Product-related pages
│   │   ├── auth/          # Authentication pages
│   │   └── ...            # Other page modules
│   ├── styles/            # CSS and styling modules
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── theme.ts           # UI theme configuration
```

### Backend Structure
```
back/Hewwwe/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── Hewwwe/
│   │   │       ├── config/        # Configuration classes
│   │   │       │   ├── SecurityConfig.java  # Security setup
│   │   │       │   └── ...        # Other configs
│   │   │       ├── controller/    # REST API controllers
│   │   │       │   ├── ProductController.java
│   │   │       │   ├── AuthController.java
│   │   │       │   └── ...        # Other controllers
│   │   │       ├── dto/           # Data transfer objects
│   │   │       ├── entity/        # JPA entity models
│   │   │       │   ├── User.java
│   │   │       │   ├── Product.java
│   │   │       │   └── ...        # Other entities
│   │   │       ├── exception/     # Custom exception handling
│   │   │       ├── repository/    # Data access interfaces
│   │   │       └── services/      # Business logic implementation
│   │   └── resources/
│   │       └── application.properties  # Application configuration
│   └── test/                     # Unit and integration tests
```

## 🔄 CI/CD Pipeline
The project includes a robust CI/CD pipeline that:
- 🧪 Runs automated tests
- 🔍 Performs code quality checks
- 🏗️ Builds Docker images
- 🚀 Deploys to staging/production environments

## 📈 Performance Optimization
The application has been optimized for:
- ⚡ Fast loading times
- 🗜️ Minimized bundle sizes
- 📱 Responsive design for all devices
- 🔍 SEO-friendly structure

## 🔄 Contributing
We welcome contributions to improve Hewwwe! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact & Support
For support, feature requests, or inquiries, please contact [nahueldevesa@gmail.com].

---

⭐ **Star this repository if you find it useful!** ⭐ 
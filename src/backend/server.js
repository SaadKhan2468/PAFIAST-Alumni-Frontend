const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*'); // ✅ Allow html2canvas to access profile picture
  }
}));

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "profile_db",
});

db.connect((err) => {
  if (err) console.error("Database connection failed: " + err);
  else console.log("Connected to database.");
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    console.log("Decoded Token Registration Number:", decoded.registration_number);
    req.user = decoded;
    next();
  });
};

// Login route
const bcrypt = require("bcrypt");

// Add this route in server.js
app.get('/api/search', (req, res) => {
  const searchQuery = req.query.q;
  const sql = `SELECT id, name, profile_picture, registration_number, department 
               FROM users2 
               WHERE name LIKE ? AND is_verified = 1
               LIMIT 10`;
  
  db.query(sql, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results.map(user => ({
      ...user,
      profilePicture: user.profile_picture ? `/uploads/${user.profile_picture}` : null
    })));
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  const sql = "SELECT id, email, password, registration_number, is_verified FROM users2 WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Database result:", result);
    
    if (result.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = result[0];
     if (!user.is_verified) {
    return res.status(401).json({ 
      success: false, 
      message: "Account pending verification. Please wait for admin approval." 
    });
  }

    // TEMPORARY: Direct password comparison
    // WARNING: This is not secure and should only be used during development
    if (password === user.password) {
      const token = jwt.sign(
        { id: user.id, email: user.email, registration_number: user.registration_number },
        "your_jwt_secret",
        { expiresIn: "1h" }
      );
      return res.json({ success: true, message: "Login successful", token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.post("/signup", (req, res) => {
  const {
    name,
    email,
    password,
    registration_number,
    graduation_year,
    department,
    whatsapp_number
  } = req.body;

  // Check if email already exists
  const checkEmailSQL = "SELECT * FROM users2 WHERE email = ?";
  db.query(checkEmailSQL, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already in use. Please use a different email or login to your existing account."
      });
    }

    // Insert new user
    const insertUserSQL = `
      INSERT INTO users2 (
        name, 
        email, 
        password, 
        registration_number, 
        graduation_year, 
        department, 
        whatsapp_number,
        is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertUserSQL,
      [name, email, password, registration_number, graduation_year, department, whatsapp_number, false],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to create user account. Please try again."
          });
        }

        res.status(201).json({
          success: true,
          message: "Account created successfully!"
        });
      }
    );
  });
});

// Add these routes to your server.js file

// Check E-Card status

app.get('/api/ecard/status', authenticateToken, (req, res) => {

  const userId = req.user.id;

  const registrationNumber = req.user.registration_number;

  

  const sql = "SELECT status FROM e_cards WHERE user_id = ? AND registration_number = ?";

  db.query(sql, [userId, registrationNumber], (err, result) => {

    if (err) {

      console.error("Database error:", err);

      return res.status(500).json({ message: "Database error" });

    }

    

    if (result.length > 0) {

      res.json({ 

        exists: true, 

        status: result[0].status 

      });

    } else {

      res.json({ 

        exists: false 

      });

    }

  });

});

// Request a new E-Card

app.post('/api/ecard/request', authenticateToken, upload.single('cardImage'), (req, res) => {

  const userId = req.user.id;

  const registrationNumber = req.user.registration_number;

  

  // Calculate expiry date (5 years from now)

  const expiryDate = new Date();

  expiryDate.setFullYear(expiryDate.getFullYear() + 5);

  const formattedExpiryDate = expiryDate.toISOString().split('T')[0];

  

  // Path to the uploaded card image

  const cardImagePath = req.file ? req.file.filename : null;

  

  // Check if user already has an E-Card request

  const checkSql = "SELECT * FROM e_cards WHERE user_id = ? AND registration_number = ?";

  db.query(checkSql, [userId, registrationNumber], (err, result) => {

    if (err) {

      console.error("Database error:", err);

      return res.status(500).json({ message: "Database error" });

    }

    

    if (result.length > 0) {

      // Update existing request

      const updateSql = `

        UPDATE e_cards 

        SET status = 'pending', 

            request_date = CURRENT_TIMESTAMP, 

            card_image = ?, 

            approved_date = NULL, 

            rejection_reason = NULL,

            expiry_date = ?

        WHERE user_id = ? AND registration_number = ?

      `;

      

      db.query(updateSql, [cardImagePath, formattedExpiryDate, userId, registrationNumber], (err, updateResult) => {

        if (err) {

          console.error("Database error:", err);

          return res.status(500).json({ message: "Database error" });

        }

        

        res.json({ message: "E-Card request updated successfully" });

      });

    } else {

      // Insert new request

      const insertSql = `

        INSERT INTO e_cards 

        (user_id, registration_number, card_image, expiry_date)

        VALUES (?, ?, ?, ?)

      `;

      

      db.query(insertSql, [userId, registrationNumber, cardImagePath, formattedExpiryDate], (err, insertResult) => {

        if (err) {

          console.error("Database error:", err);

          return res.status(500).json({ message: "Database error" });

        }

        

        res.json({ message: "E-Card request submitted successfully" });

      });

    }

  });

});

// Download approved E-Card

// ... (Previous code remains unchanged until /api/ecard/download)

// Download approved E-Card
app.get('/api/ecard/download', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const registrationNumber = req.user.registration_number;

  const sql = "SELECT card_image FROM e_cards WHERE user_id = ? AND registration_number = ? AND status = 'approved'";

  db.query(sql, [userId, registrationNumber], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0 && result[0].card_image) {
      const imagePath = path.join(__dirname, 'uploads', result[0].card_image);
      // Check if file exists
      if (fs.existsSync(imagePath)) {
        res.download(imagePath, 'PAF-IAST_Alumni_ECard.png', (err) => {
          if (err) {
            console.error("Download error:", err);
            return res.status(404).json({ message: "E-Card file not found" });
          }
        });
      } else {
        return res.status(404).json({ message: "E-Card file not found on server" });
      }
    } else {
      res.status(404).json({ message: "No approved E-Card found" });
    }
  });
});

// View E-Card (Serve file as a stream for preview)
const fs = require('fs'); // Add this at the top of the file

app.get('/api/ecard/view', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const registrationNumber = req.user.registration_number;

  const sql = "SELECT card_image FROM e_cards WHERE user_id = ? AND registration_number = ? AND status = 'approved'";

  db.query(sql, [userId, registrationNumber], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0 && result[0].card_image) {
      const imagePath = path.join(__dirname, 'uploads', result[0].card_image);
      if (fs.existsSync(imagePath)) {
        res.setHeader('Content-Type', 'image/png'); // Adjust MIME type as needed
        fs.createReadStream(imagePath).pipe(res);
      } else {
        return res.status(404).json({ message: "E-Card file not found on server" });
      }
    } else {
      res.status(404).json({ message: "No approved E-Card found" });
    }
  });
});

// ... (Rest of the code remains unchanged)



// Add this route in server.js
app.get('/api/profile/:registrationNumber', (req, res) => {
  const registrationNumber = req.params.registrationNumber;
  
  const sql = `SELECT name, whatsapp_number, profile_picture, certificates, 
               is_employed, looking_for_job, graduation_year, department 
               FROM users2 
               WHERE registration_number = ?`;
  
  db.query(sql, [registrationNumber], (err, result) => {
    if (err) {
      console.error("Profile fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length > 0) {
      const user = result[0];
      res.json({
        name: user.name,
        whatsapp: user.whatsapp_number,
        profilePicture: user.profile_picture ? `/uploads/${user.profile_picture}` : null,
        certificates: user.certificates ? `/uploads/${user.certificates}` : null,
        isEmployed: Boolean(user.is_employed),
        lookingForJob: Boolean(user.looking_for_job),
        graduationYear: user.graduation_year,
        department: user.department
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Add these endpoints in server.js

// Get education by registration number
app.get('/api/education/:registrationNumber', (req, res) => {
  const regNum = req.params.registrationNumber;
  const sql = "SELECT * FROM edu_info WHERE registration_number = ?";
  db.query(sql, [regNum], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result[0] || {});
  });
});

// Get skills by registration number
app.get('/api/skills/:registrationNumber', (req, res) => {
  const regNum = req.params.registrationNumber;
  const sql = "SELECT skills FROM user_skills_achievements WHERE registration_number = ?";
  db.query(sql, [regNum], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    const skills = result[0]?.skills ? JSON.parse(result[0].skills) : [];
    res.json(skills);
  });
});

// Get internships by registration number
app.get('/api/internships/:registrationNumber', (req, res) => {
  const regNum = req.params.registrationNumber;
  const sql = "SELECT * FROM internships WHERE registration_number = ? ORDER BY start_date DESC";
  db.query(sql, [regNum], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Get projects by registration number
app.get('/api/projects/:registrationNumber', (req, res) => {
  const regNum = req.params.registrationNumber;
  const sql = "SELECT * FROM projects WHERE registration_number = ? ORDER BY completion_date DESC";
  db.query(sql, [regNum], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Get achievements by registration number
app.get('/api/achievements/:registrationNumber', (req, res) => {
  const regNum = req.params.registrationNumber;
  const sql = "SELECT * FROM achievements WHERE registration_number = ? ORDER BY id DESC";
  db.query(sql, [regNum], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});
// Fetch profile route
app.get("/api/profile", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT name, whatsapp_number, profile_picture, certificates, is_employed, looking_for_job, graduation_year, department FROM users2 WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) {
      const user = result[0];
      
      // Add console.log to debug the raw database values
      console.log("Database values:", user);
      
      res.json({
        name: user.name,
        whatsapp: user.whatsapp_number,
        profilePicture: user.profile_picture ? `/uploads/${user.profile_picture}` : null,
        certificates: user.certificates ? `/uploads/${user.certificates}` : null,
        isEmployed: Boolean(user.is_employed),
        lookingForJob: Boolean(user.looking_for_job),
        graduationYear: user.graduation_year,
        department: user.department,
        registrationNumber: req.user.registration_number

      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Update profile route
app.post(
  "/api/profile",
  authenticateToken,
  upload.fields([ 
    { name: "profilePicture", maxCount: 1 }, 
    { name: "certificates", maxCount: 1 } 
  ]),
  (req, res) => {
    const userId = req.user.id;
    const { name, whatsapp, isEmployed, lookingForJob } = req.body;

    // Get filenames from uploaded files
    const profilePicture = req.files?.profilePicture?.[0]?.filename;
    const certificates = req.files?.certificates?.[0]?.filename;

    let sql = `
      UPDATE users2 
      SET 
        name = ?,
        whatsapp_number = ?,
        is_employed = ?,
        looking_for_job = ?
    `;
    let values = [
      name || null,
      whatsapp || null,
      isEmployed === 'true' ? 1 : 0,
      lookingForJob === 'true' ? 1 : 0
    ];

    if (profilePicture) {
      sql += ", profile_picture = ?";
      values.push(profilePicture);
    }

    if (certificates) {
      sql += ", certificates = ?";
      values.push(certificates);
    }

    sql += " WHERE id = ?";
    values.push(userId);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Profile updated successfully" });
    });
  }
);

// Save education details route
app.post("/api/education", authenticateToken, (req, res) => {
  console.log("User registration number from token:", req.user.registration_number); // Debug log
  const registrationNumber = req.user.registration_number;
  const { matricInstitute, matricDegree, matricYear, matricPercentage, fscInstitute, fscDegree, fscYear, fscPercentage } = req.body;
  

  if (!registrationNumber) {
    console.error("Registration number missing in token");
    return res.status(400).json({ message: "Registration number is required." });
  }

  const query = `
    INSERT INTO edu_info (registration_number, matric_institute, matric_degree, matric_year, matric_percentage, fsc_institute, fsc_degree, fsc_year, fsc_percentage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    matric_institute = VALUES(matric_institute), matric_degree = VALUES(matric_degree),
    matric_year = VALUES(matric_year), matric_percentage = VALUES(matric_percentage),
    fsc_institute = VALUES(fsc_institute), fsc_degree = VALUES(fsc_degree),
    fsc_year = VALUES(fsc_year), fsc_percentage = VALUES(fsc_percentage);
  `;

  db.query(query, [registrationNumber, matricInstitute, matricDegree, matricYear, matricPercentage, fscInstitute, fscDegree, fscYear, fscPercentage], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Education details saved successfully!" });
  });
});

// Add this route in server.js
app.get("/api/education", authenticateToken, (req, res) => {
  const registrationNumber = req.user.registration_number;
  
  const sql = "SELECT * FROM edu_info WHERE registration_number = ?";
  db.query(sql, [registrationNumber], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result[0] || {});
  });
});

// Add these routes to server.js

// Get internships
app.get('/api/internships', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const sql = "SELECT * FROM internships WHERE registration_number = ?";
    db.query(sql, [registrationNumber], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(result);
    });
});

// Add new internship
app.post('/api/internships', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const { title, company, duration, start_date, end_date, description, paid } = req.body;
    
    const sql = `
        INSERT INTO internships 
        (registration_number, title, company, duration, start_date, end_date, description, paid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, 
        [registrationNumber, title, company, duration, start_date, end_date, description, paid], 
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            
            // Return the newly created internship with ID
            const newInternship = {
                id: result.insertId,
                registration_number: registrationNumber,
                ...req.body
            };
            
            res.json(newInternship);
        }
    );
});

// Update existing internship
app.put('/api/internships/:id', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const internshipId = req.params.id;
    const { title, company, duration, start_date, end_date, description, paid } = req.body;
    
    // First verify that this internship belongs to this user
    const checkQuery = "SELECT * FROM internships WHERE id = ? AND registration_number = ?";
    db.query(checkQuery, [internshipId, registrationNumber], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        
        if (result.length === 0) {
            return res.status(403).json({ message: "Unauthorized access or internship not found" });
        }
        
        // Update the internship
        const updateQuery = `
            UPDATE internships 
            SET title = ?, company = ?, duration = ?, 
                start_date = ?, end_date = ?, description = ?, paid = ? 
            WHERE id = ? AND registration_number = ?
        `;
        
        db.query(updateQuery, 
            [title, company, duration, start_date, end_date, description, paid, internshipId, registrationNumber], 
            (err, updateResult) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Database error updating internship" });
                }
                
                // Return the updated internship
                res.json({
                    id: parseInt(internshipId),
                    registration_number: registrationNumber,
                    title,
                    company,
                    duration,
                    start_date,
                    end_date,
                    description,
                    paid
                });
            }
        );
    });
});

// Delete internship (Keep this for potential future use but it's not shown in UI anymore)
app.delete('/api/internships/:id', authenticateToken, (req, res) => {
    const sql = "DELETE FROM internships WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Internship deleted successfully" });
    });
});

// Add these routes to your server.js file

// Get all projects for a user
app.get('/api/projects', authenticateToken, (req, res) => {
  const registrationNumber = req.user.registration_number;
  
  const sql = "SELECT * FROM projects WHERE registration_number = ? ORDER BY completion_date DESC";
  db.query(sql, [registrationNumber], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
});

// Add a new project
app.post('/api/projects', authenticateToken, (req, res) => {
  const registrationNumber = req.user.registration_number;
  const { project_title, project_description, completion_date, months_taken } = req.body;
  
  const sql = `
    INSERT INTO projects 
    (registration_number, project_title, project_description, completion_date, months_taken)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(sql, 
    [registrationNumber, project_title, project_description, completion_date, months_taken], 
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      
      // Return the newly created project with ID
      const newProject = {
        id: result.insertId,
        registration_number: registrationNumber,
        ...req.body
      };
      
      res.json(newProject);
    }
  );
});

// Update existing project
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const registrationNumber = req.user.registration_number;
  const projectId = req.params.id;
  const { project_title, project_description, completion_date, months_taken } = req.body;
  
  // First verify that this project belongs to this user
  const checkQuery = "SELECT * FROM projects WHERE id = ? AND registration_number = ?";
  db.query(checkQuery, [projectId, registrationNumber], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (result.length === 0) {
      return res.status(403).json({ message: "Unauthorized access or project not found" });
    }
    
    // Update the project
    const updateQuery = `
      UPDATE projects 
      SET project_title = ?, project_description = ?, completion_date = ?, months_taken = ? 
      WHERE id = ? AND registration_number = ?
    `;
    
    db.query(updateQuery, 
      [project_title, project_description, completion_date, months_taken, projectId, registrationNumber], 
      (err, updateResult) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error updating project" });
        }
        
        // Return the updated project
        res.json({
          id: parseInt(projectId),
          registration_number: registrationNumber,
          project_title,
          project_description,
          completion_date,
          months_taken
        });
      }
    );
  });
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const registrationNumber = req.user.registration_number;
  const projectId = req.params.id;
  
  // First verify that this project belongs to this user
  const checkQuery = "SELECT * FROM projects WHERE id = ? AND registration_number = ?";
  db.query(checkQuery, [projectId, registrationNumber], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (result.length === 0) {
      return res.status(403).json({ message: "Unauthorized access or project not found" });
    }
    
    // Delete the project
    const deleteQuery = "DELETE FROM projects WHERE id = ? AND registration_number = ?";
    db.query(deleteQuery, [projectId, registrationNumber], (err, deleteResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error deleting project" });
      }
      
      res.json({ message: "Project deleted successfully" });
    });
  });
});

// Get jobs
app.get('/api/jobs', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const sql = "SELECT * FROM jobs WHERE registration_number = ?";
    db.query(sql, [registrationNumber], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(result);
    });
});

// Add new job
app.post('/api/jobs', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const { job_title, organization, joining_date, job_description } = req.body;
    
    const sql = `
        INSERT INTO jobs 
        (registration_number, job_title, organization, joining_date, job_description)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(sql, 
        [registrationNumber, job_title, organization, joining_date, job_description], 
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            
            const newJob = {
                id: result.insertId,
                registration_number: registrationNumber,
                ...req.body
            };
            
            res.json(newJob);
        }
    );
});

// Update existing job
app.put('/api/jobs/:id', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const jobId = req.params.id;
    const { job_title, organization, joining_date, job_description } = req.body;
    
    const checkQuery = "SELECT * FROM jobs WHERE id = ? AND registration_number = ?";
    db.query(checkQuery, [jobId, registrationNumber], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        
        if (result.length === 0) {
            return res.status(403).json({ message: "Unauthorized access or job not found" });
        }
        
        const updateQuery = `
            UPDATE jobs 
            SET job_title = ?, organization = ?, joining_date = ?, job_description = ?
            WHERE id = ? AND registration_number = ?
        `;
        
        db.query(updateQuery, 
            [job_title, organization, joining_date, job_description, jobId, registrationNumber], 
            (err, updateResult) => {
                if (err) return res.status(500).json({ message: "Database error updating job" });
                
                res.json({
                    id: parseInt(jobId),
                    registration_number: registrationNumber,
                    ...req.body
                });
            }
        );
    });
});


// Skills routes
app.get('/api/skills', authenticateToken, (req, res) => {
    const regNum = req.user.registration_number;
    const sql = "SELECT skills FROM user_skills_achievements WHERE registration_number = ?";
    
    db.query(sql, [regNum], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        
        // Handle MySQL JSON parsing
        let skills = [];
        if (result[0]?.skills) {
            try {
                skills = typeof result[0].skills === 'string' 
                    ? JSON.parse(result[0].skills)
                    : result[0].skills;
            } catch (e) {
                console.error("JSON parse error:", e);
            }
        }
        
        res.json({ skills });
    });
});

// Update skills
app.post('/api/skills', authenticateToken, (req, res) => {
    const regNum = req.user.registration_number;
    const { skills } = req.body;
    
    const sql = `
        INSERT INTO user_skills_achievements (registration_number, skills)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        skills = VALUES(skills)
    `;
    
    db.query(sql, [regNum, JSON.stringify(skills)], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ skills });
    });
});

app.delete('/api/skills/:id', authenticateToken, (req, res) => {
    const regNum = req.user.registration_number;
    const sql = "DELETE FROM user_skills_achievements WHERE id = ? AND registration_number = ? AND type = 'skill'";
    db.query(sql, [req.params.id, regNum], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Skill deleted successfully" });
    });
});

// Achievements routes
// Updated Achievements routes for server.js

// Get achievements
app.get('/api/achievements', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    
    const sql = "SELECT * FROM achievements WHERE registration_number = ?";
    db.query(sql, [registrationNumber], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});

// Add achievement
app.post('/api/achievements', authenticateToken, upload.single('file'), (req, res) => {
    const registrationNumber = req.user.registration_number;
    const { title, details } = req.body;
    const filePath = req.file ? req.file.filename : null;
    
    const sql = `
        INSERT INTO achievements 
        (registration_number, title, details, file_path)
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(sql, 
        [registrationNumber, title, details, filePath], 
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            
            // Return the newly created achievement with ID
            const newAchievement = {
                id: result.insertId,
                registration_number: registrationNumber,
                title,
                details,
                file_path: filePath
            };
            
            res.json(newAchievement);
        }
    );
});

// Update existing achievement
app.put('/api/achievements/:id', authenticateToken, upload.single('file'), (req, res) => {
    const registrationNumber = req.user.registration_number;
    const achievementId = req.params.id;
    const { title, details } = req.body;
    
    // First verify that this achievement belongs to this user
    const checkQuery = "SELECT * FROM achievements WHERE id = ? AND registration_number = ?";
    db.query(checkQuery, [achievementId, registrationNumber], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        
        if (result.length === 0) {
            return res.status(403).json({ message: "Unauthorized access or achievement not found" });
        }
        
        let updateQuery;
        let queryParams;
        
        if (req.file) {
            // If there's a new file, update the file path
            updateQuery = `
                UPDATE achievements 
                SET title = ?, details = ?, file_path = ? 
                WHERE id = ? AND registration_number = ?
            `;
            queryParams = [title, details, req.file.filename, achievementId, registrationNumber];
        } else {
            // If there's no new file, keep the existing file path
            updateQuery = `
                UPDATE achievements 
                SET title = ?, details = ? 
                WHERE id = ? AND registration_number = ?
            `;
            queryParams = [title, details, achievementId, registrationNumber];
        }
        
        db.query(updateQuery, queryParams, (err, updateResult) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error updating achievement" });
            }
            
            // Get the updated achievement with file_path
            db.query("SELECT * FROM achievements WHERE id = ?", [achievementId], (err, fetchResult) => {
                if (err || fetchResult.length === 0) {
                    console.error("Error fetching updated achievement:", err);
                    return res.status(500).json({ message: "Error fetching updated achievement" });
                }
                
                res.json(fetchResult[0]);
            });
        });
    });
});

// Delete achievement (optional)
app.delete('/api/achievements/:id', authenticateToken, (req, res) => {
    const registrationNumber = req.user.registration_number;
    const achievementId = req.params.id;
    
    // First verify that this achievement belongs to this user
    const checkQuery = "SELECT * FROM achievements WHERE id = ? AND registration_number = ?";
    db.query(checkQuery, [achievementId, registrationNumber], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        
        if (result.length === 0) {
            return res.status(403).json({ message: "Unauthorized access or achievement not found" });
        }
        
        // Delete the achievement
        const deleteQuery = "DELETE FROM achievements WHERE id = ? AND registration_number = ?";
        db.query(deleteQuery, [achievementId, registrationNumber], (err, deleteResult) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error deleting achievement" });
            }
            
            res.json({ message: "Achievement deleted successfully" });
        });
    });
});

// Send email route
app.post("/api/send-email", upload.single('attachment'), (req, res) => {
  const {
    attestationType,
    degreeLevel,
    registrationNumber,
    studentName,
    graduationYear,
    email,
    phone,
    additionalInfo
  } = req.body;

  // Create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sajidnazeereo@gmail.com',
      pass: 'uhnicejhvepajxrn'
    }
  });

  // Prepare email options
  const mailOptions = {
    from: 'sajidnazeereo@gmail.com',
    to: 'msaadkhan200212@gmail.com',
    subject: attestationType || 'Degree Attestation Request',
    html: `
      <h2>${attestationType || 'Degree Attestation Request'}</h2>
      ${attestationType === 'Alumni Card Application' ? `
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Registration Number:</strong> ${registrationNumber}</p>
        <p><strong>Graduation Year:</strong> ${graduationYear}</p>
        <p><strong>CNIC:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${additionalInfo ? `<p><strong>Additional Information:</strong><br>${additionalInfo}</p>` : ''}
      ` : `
        <p><strong>Attestation Type:</strong> ${attestationType}</p>
        <p><strong>Degree Level:</strong> ${degreeLevel}</p>
        <p><strong>Registration Number:</strong> ${registrationNumber}</p>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Year of Graduation:</strong> ${graduationYear}</p>
        <p><strong>Contact Information:</strong></p>
        <ul>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
        </ul>
      `}
    `
  };

  // Add attachment if file was uploaded
  if (req.file) {
    mailOptions.attachments = [{
      filename: req.file.originalname,
      path: req.file.path
    }];
    console.log('Attaching file:', req.file.path);
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});
// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
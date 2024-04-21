
import pkg from 'express-validator';
import User  from "../../mongoose/schemas/user.mjs";

import Tenants from "../../mongoose/schemas/tenant.mjs";
import Project from "../../mongoose/schemas/project.mjs";

const { body, param, query, validationResult, matchedData } = pkg;

// Validates user registration fields
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address format.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('firstName')
    .optional()
    .isAlpha()
    .withMessage('First name must contain only alphabetic characters.'),
  body('lastName')
    .optional()
    .isAlpha()
    .withMessage('Last name must contain only alphabetic characters.'),
  body('role')
    .isIn(['Admin', 'User', 'Developer', 'ProjectManager'])
    .withMessage('Invalid role specified.'),
];

// Validates user login fields
export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address format.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

// Validates tenant creation fields
export const validateTenantCreation = [
  body('name')
    .notEmpty()
    .withMessage('Tenant name is required.'),
  body('domain')
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage('Domain must contain only alphanumeric characters and hyphens.'),
];

// Validates tenant and user IDs in URL parameters
export const validateIds = [
  param('tenantId')
    .isUUID()
    .withMessage('Invalid tenant ID format.'),
  param('userId')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID format.'),
];

// Validates query parameters for filtering
export const validateFilterQuery = [
  query('filter')
    .optional()
    .isString()
    .withMessage('Filter must be a string.'),
];

// Middleware to check the result of the validations
export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
  }
  next();
};


export const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  };

 
  const tenantExists = async (tenantId) => {
    const tenant = await Tenants.findById(tenantId);
    return !!tenant;
  };
  
  
  const checkEmailUniqueness = async (email, userId, tenantId) => {
    const query = { email, tenantId };
    if (userId) {
      query._id = { $ne: userId };
    }
    const user = await User.findOne(query);
    return !user;
  };
  
  const checkUsernameUniqueness = async (username, userId, tenantId) => {
    const query = { username, tenantId };
    if (userId) {
      query._id = { $ne: userId };
    }
    const user = await User.findOne(query);
    return !user;
  };
  
  
 

  export const userValidationRules = () => {
    return [
      body('email')
        .custom(async (email, { req }) => {
          const isUnique = await checkEmailUniqueness(email, req.params.userId);
          if (!isUnique) throw new Error('Email is already in use.');
        }),
      body('tenantId')
        .custom(async (tenantId) => {
          const exists = await tenantExists(tenantId);
          if (!exists) throw new Error('Tenant does not exist.');
        }),

      body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('role')
        .isIn(['Admin', 'User', 'Developer', 'ProjectManager', 'Support'])
        .withMessage('Invalid role specified'),
    ];
  };

  export const createUserValidationRules = () => {
    return [
      body('username')
        .notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 3, max: 15 }).withMessage('Username must be between 3 and 15 characters')
        .isString().withMessage('Username must be a string'),
      body('email')
        .isEmail().withMessage('Invalid email address format')
        .normalizeEmail(),
      body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('role')
        .isIn(['Admin', 'User', 'Developer', 'ProjectManager', 'Support'])
        .withMessage('Invalid role specified'),
      // Add more validations as needed
    ];
  };
  export const filterQueryValidationRules = () => {
    return [
      query('filter')
        .isString().withMessage('Must be a string')
        .notEmpty().withMessage('Must not be empty')
        .isLength({ min: 3, max: 10 }).withMessage('Must be between 3 and 10 characters'),
    ];
  };
  // Define validation rules for updating a user
export const updateUserValidationRules = () => [
    body('email')
      .optional()
      .isEmail().withMessage('Invalid email address format')
      .normalizeEmail()
      .custom(async (email, { req }) => {
        // Check if the email is unique, excluding the current user
        const isUnique = await checkEmailUniqueness(email, req.params.userId);
        if (!isUnique) throw new Error('Email is already in use.');
      }),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['Admin', 'User', 'Developer',  'ProjectManager'])
      .withMessage('Invalid role specified'),
      body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1 }).withMessage('First name must not be empty'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1 }).withMessage('Last name must not be empty'),
      body('isAdmin')
      .optional()
      .isBoolean().withMessage('isAdmin must be a boolean value'),
  ];
  
  // Reuse the existing validate middleware for error handling
  
  
  export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    next();
  };

  
// Validator Middleware for Task Data
export const validateTaskData = async (req, res, next) => {
  const { title, projectId, type, priority, status, assigneeId, reporterId } = req.body;

  // Validate required fields
  if (!title || !projectId || !type || !priority || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Validate projectId, assigneeId, and reporterId against database
    const project = await Project.findById(projectId);
    const assignee = await User.findById(assigneeId);
    const reporter = await User.findById(reporterId);

    if (!project) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!assignee) {
      return res.status(400).json({ message: "Invalid assigneeId" });
    }
    if (!reporter) {
      return res.status(400).json({ message: "Invalid reporterId" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Validation error", error: error.message });
  }

  next();
};


function validateTenantContext(req, res, next) {
  const userTenantId = req.user.tenantId; // Assuming this is set during authentication
  const requestedTenantId = req.params.tenantId || req.body.tenantId;

  if (!requestedTenantId) {
      return res.status(400).json({ message: "Tenant ID is required." });
  }

  if (userTenantId.toString() !== requestedTenantId.toString()) {
      return res.status(403).json({ message: "Access denied. Cross-tenant access is not allowed." });
  }

  next();
}


// Task validations for creation and updates
export const taskValidations = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('type')
    .isIn(['Task', 'Bug', 'Epic', 'Story'])
    .withMessage('Invalid type specified'),

  body('priority')
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Invalid priority specified'),

  body('status')
    .isIn(['ToDo', 'InProgress', 'Done'])
    .withMessage('Invalid status specified'),

  // For task creation, projectId is required. For updates, it might not be necessary to change.
  body('projectId')
    .optional({ checkFalsy: true }) // Makes this check only if projectId is provided
    .isMongoId()
    .withMessage('Invalid Project ID'),

  body('assigneeId')
    .optional({ checkFalsy: true }) // Makes this field optional
    .isMongoId()
    .withMessage('Invalid Assignee ID'),

  body('reporterId')
    .optional({ checkFalsy: true }) // Makes this field optional
    .isMongoId()
    .withMessage('Invalid Reporter ID'),

  // Validate dueDate if provided, ensure it's a valid date format
  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid due date'),

  // tags validation (optional)
  body('tags')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Tags must be an array'),

  // Validate each tag in the array (optional)
  body('tags.*')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Tags cannot be empty'),

  // imageUrls validation (optional)
  body('imageUrls')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Image URLs must be an array'),

  // Validate each URL in the array (optional)
  body('imageUrls.*')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Invalid URL format in image URLs'),
];

// Mock data for tenants
export const tenants = [
  { "id": 1, "name": "Acme Corporation", "domain": "acme.com", "createdAt": "2024-02-08T12:00:00Z", "updatedAt": "2024-02-08T12:00:00Z" },
  { "id": 2, "name": "Globex Corporation", "domain": "globex.com", "createdAt": "2024-02-08T13:00:00Z", "updatedAt": "2024-02-08T13:00:00Z" },
];
    export const users = [
        {
            "id": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437", 
            "tenantId": 1,
            "username": "testuser1",
            "email": "john.doe@acme.com",
            "firstName": "John",
            "lastName": "Doe",
            "password": "testuser1", // Plain text for mock; in real usage, hash this!
            "role": "Admin",
            "createdAt": "2024-02-08T12:10:00Z",
            "updatedAt": "2024-02-08T12:10:00Z",

          },
        {
          "id": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437",
          "tenantId": 2,
          "username": "testuser2",
          "email": "jane.smith@globex.com",
          "firstName": "Jane",
          "lastName": "Smith",
          "password": "testuser2", // Plain text for mock; in real usage, hash this!
          "role": "ProjectManager",
          "createdAt": "2024-02-08T13:10:00Z",
          "updatedAt": "2024-02-08T13:10:00Z"
        },
      ]
      
      export const projects = [
        {
          "id": 1,
          "tenantId": 1,
          "name": "Project Mercury",
          "description": "This project aims to develop a new generation of high-speed transportation vehicles.",
          "status": "Active",
          "creatorId": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437", // Adjusted to UUID
          "createdAt": "2024-01-10T08:00:00Z",
          "updatedAt": "2024-02-10T09:00:00Z"
        },
        {
          "id": 2,
          "tenantId": 1,
          "name": "Project Apollo",
          "description": "A project focused on creating sustainable living habitats on Mars.",
          "status": "OnHold",
          "creatorId": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437", // Adjusted to UUID
          "createdAt": "2024-01-15T10:00:00Z",
          "updatedAt": "2024-02-15T11:00:00Z"
        }
      ];
      
  
      export const tasks = [
        {
          "id": 1,
          "tenantId": 1,
          "title": "Implement OAuth Authentication",
          "description": "Add support for OAuth 2.0 to allow users to log in using external providers.",
          "type": "Task",
          "priority": "High",
          "status": "ToDo",
          "assigneeId": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437", // Assigned to the second user
          "reporterId": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437", // Reported by the first user
          "projectId": 1,
          "parentId": null,
          "dueDate": "2024-03-15",
          "tags": ["authentication", "security", "login"],
          "createdAt": "2024-02-09T09:30:00Z",
          "updatedAt": "2024-02-09T09:30:00Z"
        },
        {
          "id": 2,
          "tenantId": 1,
          "title": "Fix Homepage Loading Performance",
          "description": "Investigate and resolve the slow loading times experienced on the homepage under heavy load.",
          "type": "Bug",
          "priority": "Medium",
          "status": "InProgress",
          "assigneeId": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437", // Assigned to the first user
          "reporterId": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437", // Reported by the second user
          "projectId": 1,
          "parentId": null,
          "dueDate": "2024-03-20",
          "tags": ["performance", "optimization", "frontend"],
          "createdAt": "2024-02-10T10:45:00Z",
          "updatedAt": "2024-02-10T11:00:00Z"
        }
      ];
      

// Mock data for comments

export const comments = [
  {
    "id": 1,
    "tenantId": 1,
    "body": "This is an initial comment on the task.",
    "taskId": 1,
    "userId": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437",
    "createdAt": "2024-02-12T10:00:00Z",
    "updatedAt": "2024-02-12T10:00:00Z"
  },
  {
    "id": 2,
    "tenantId": 1,
    "body": "This is a follow-up comment on the task.",
    "taskId": 2,
    "userId": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437",
    "createdAt": "2024-02-13T11:30:00Z",
    "updatedAt": "2024-02-13T11:30:00Z"
  }
]


// Mock data for sprint

export const sprints = [
  {
    "id": 1,
    "tenantId": 1,
    "name": "Sprint 1",
    "startDate": "2024-02-01",
    "endDate": "2024-02-14",
    "status": "Active",
    "projectId": 1,
    "createdAt": "2024-01-25T09:00:00Z",
    "updatedAt": "2024-01-25T09:00:00Z"
  },
  {
    "id": 2,
    "tenantId": 1,
    "name": "Sprint 2",
    "startDate": "2024-02-15",
    "endDate": "2024-02-28",
    "status": "Planned",
    "projectId": 1,
    "createdAt": "2024-01-26T09:30:00Z",
    "updatedAt": "2024-01-26T09:30:00Z"
  }
]


// Mock data for projectUsers

export const projectUsers = [
  {
    "projectId": 1,
    "userId": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437"
  },
  {
    "projectId": 1,
    "userId": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437"
  }
]

 // Mock data for SprintTasks

export const sprintTasks = [
  {
    "sprintId": 1,
    "taskId": 1
  },
  {
    "sprintId": 1,
    "taskId": 2
  }
]


// Mock data for TaskLinks

export const taskLinks = [
  {
    "id": 1,
    "sourceTaskId": 1,
    "targetTaskId": 2,
    "type": "BlockedBy",
    "createdAt": "2024-02-14T09:00:00Z",
    "updatedAt": "2024-02-14T09:00:00Z"
  },
  {
    "id": 2,
    "sourceTaskId": 2,
    "targetTaskId": 1,
    "type": "RelatedTo",
    "createdAt": "2024-02-15T10:00:00Z",
    "updatedAt": "2024-02-15T10:00:00Z"
  }
]


// Mock data for TaskEvents
export const eventLogs = [

  {
    "id": 1,
    "tenantId": 1,
    "eventType": "TaskCreated",
    "entityId": 1,
    "userId": "a58f7dc4-dead-4ca7-b7c7-f6dc0d0b3437",
    "details": {
      "description": "Task for implementing OAuth Authentication was created."
    },
    "createdAt": "2024-02-14T09:30:00Z"
  },
  {
    "id": 2,
    "tenantId": 1,
    "eventType": "TaskUpdated",
    "entityId": 1,
    "userId": "k58f7dc4-dead-4ca7-b7c7-f6hu0d0b3437",
    "details": {
      "update": "Priority was changed from Medium to High."
    },
    "createdAt": "2024-02-15T11:30:00Z"
  }
]


// Mock data for Boards

export const boards = [
  {
    "id": 1,
    "tenantId": 1,
    "projectId": 1,
    "name": "Development Board",
    "type": "Kanban",
    "configuration": {
      "columns": ["Backlog", "ToDo", "InProgress", "Done"]
    },
    "createdAt": "2024-02-20T09:00:00Z",
    "updatedAt": "2024-02-20T09:00:00Z"
  },
  {
    "id": 2,
    "tenantId": 1,
    "projectId": 1,
    "name": "Sprint Planning",
    "type": "Scrum",
    "configuration": {
      "sprints": ["Sprint 1", "Sprint 2", "Sprint 3"]
    },
    "createdAt": "2024-02-21T10:00:00Z",
    "updatedAt": "2024-02-21T10:00:00Z"
  }
]


// Mock data for BoardTasks

export const boardTasks = [
  {
    "boardId": 1,
    "taskId": 1,
    "position": 1,
    "column": "ToDo"
  },
  {
    "boardId": 1,
    "taskId": 2,
    "position": 2,
    "column": "InProgress"
  }
]


import { Router } from "express";
import { validateTenantExists } from '../component/utils/middleware.mjs';
import userRouter from "./users.mjs";
import tenantRouter from "./tenants.mjs";
import projectRouter from "./projects.mjs";
import taskRouter from "./tasksRouter.mjs";
import commentsRouter  from "./comments.mjs";
import sprintRouter from "./sprints.mjs";
import projectUserRouter from "./projectUser.mjs";
import sprintTaskRouter from "./sprintTask.mjs";
import eventLogRouter from "./eventLog.mjs";
import boardRouter from "./board.mjs";
import boardTasksRouter from "./boardTasks.mjs";
import authRouter from "./auth.mjs";
import authGoogle from "./authGoogle.mjs";
import tenantUser from "./tenantUser.mjs";
import profileRouter from "./profile.mjs";
import registrationRouter from "./registration.mjs";
import teamRouter from "./team.mjs";
import ProjectTeamRouter from "./projectTeam.mjs";
import taskTeamRouter from "./taskTeam.mjs";




const router = Router();

router.use(userRouter);
router.use(tenantRouter);
router.use(tenantUser);
router.use('/api', projectRouter);
router.use('/api', taskRouter);
router.use("/api", commentsRouter);
router.use("/api/tenants/:tenantId", validateTenantExists, sprintRouter);
router.use("/api/projectUser", projectUserRouter);
router.use("/api/sprintTask", sprintTaskRouter);
router.use("/api/eventLog", eventLogRouter);
router.use("/api/board", boardRouter);
router.use("/api/boardTasks", boardTasksRouter);
router.use("/api", authGoogle);
router.use(registrationRouter);
router.use("/api", profileRouter);
router.use("/api", authRouter);
router.use("/api", teamRouter);
router.use("/api", ProjectTeamRouter);
router.use("/api", taskTeamRouter);



export default router;
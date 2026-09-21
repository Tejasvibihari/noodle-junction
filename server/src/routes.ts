import { Router } from 'express';

/**
 * All /api/v1 routes are mounted here, one router per domain module
 * (auth, branch, order, ...). Modules are added as M1..M18 are built.
 */
export const apiRouter = Router();

import { Router } from "express";
import {
  CheckAnnouncements,
  CreateDetailedAnnouncements,
  DeleteDetailedAnnouncement,
  DeleteDetailedAnnouncementByIdOther,
  GetAnnouncements,
  GetDetailedAnnouncements,
  ReadAnnouncements,
} from "../Controllers/Announcement.controller";

import TCWrapper from "../Utils/TCWrapper.Utils";

const router = Router();

router
  .get("/api/detailedAnnouncement/:id", TCWrapper(GetDetailedAnnouncements))
  .get("/api/announcements/:id", TCWrapper(GetAnnouncements))
  .post("/api/detailedAnnouncement", TCWrapper(CreateDetailedAnnouncements))
  .post("/api/announcements", TCWrapper(CheckAnnouncements))
  .delete("/api/detailedAnnouncement", TCWrapper(DeleteDetailedAnnouncement))
  .delete(
    "/api/detailedAnnouncement/idOther",
    TCWrapper(DeleteDetailedAnnouncementByIdOther)
  )
  .patch("/api/detailedAnnouncement", TCWrapper(ReadAnnouncements))
  .patch("/api/announcements", TCWrapper(CheckAnnouncements));

export default router;

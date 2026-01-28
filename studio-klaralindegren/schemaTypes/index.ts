import { postType } from "./postType"
import { contactEmail } from "./contactEmail"
import { contactLink } from "./contactLink"
import { resumeDescription, resumeEducation, resumeWork, resumeRoleRepertoire } from "./resume"
import { mediaEntry } from "./media"
import { reviewEntry } from "./review"
import { upcomingEntry } from "./upcoming"

export const schemaTypes = [
  postType,
  contactEmail,
  contactLink,
  resumeDescription,
  resumeEducation,
  resumeWork,
  resumeRoleRepertoire,
  mediaEntry,
  reviewEntry,
  upcomingEntry,
]

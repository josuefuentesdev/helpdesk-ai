import { Home, Loader2, ArrowDown, AlertTriangle, AlertOctagon, Clock, HardDrive, Upload, Image, ChevronDown } from "lucide-react"
import { IoTicketOutline } from "react-icons/io5";
import { LuBox, LuCloud, LuCode, LuCpu, LuDownload, LuUser, LuX, LuTrash, LuPlus, LuEye, LuSquarePen } from "react-icons/lu"
import { FaGithub } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { Check, ChevronsUpDown } from "lucide-react"

export const Icons = {
  home: Home,
  user: LuUser,
  ticket: IoTicketOutline,
  assets: MdDevices,
  check: Check,
  chevronsUpDown: ChevronsUpDown,
  chevronDown: ChevronDown,
  view: LuEye,
  edit: LuSquarePen,
  download: LuDownload,

  // asset types
  HARDWARE: LuCpu,         // Represents physical computing hardware
  SOFTWARE: LuCode,       // Indicates installed or locally running software
  SAAS: LuCloud,           // Represents cloud-based services (SaaS)
  OTHER: LuBox,            // A generic container/icon for miscellaneous items

  // ticket priorities
  LOW: ArrowDown,
  MEDIUM: ArrowDown,
  HIGH: AlertTriangle,
  URGENT: AlertOctagon,

  // dashboard icons
  clock: Clock,
  hardDrive: HardDrive,
  plus: LuPlus,

  // Information
  alert: AlertTriangle,

  // brands
  github: FaGithub,

  loader: Loader2,
  spinner: Loader2,
  x: LuX,
  trash: LuTrash,
  upload: Upload,
  imageIcon: Image,
}
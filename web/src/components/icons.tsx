import { Home } from "lucide-react"
import { IoTicketOutline } from "react-icons/io5";
import { LuBox, LuCloud, LuCode, LuCpu, LuDownload, LuUser, LuX } from "react-icons/lu"
import { MdDevices } from "react-icons/md";
import { Check, ChevronsUpDown } from "lucide-react"
import { LuEye } from "react-icons/lu";
import { LuSquarePen } from "react-icons/lu";

export const Icons = {
  home: Home,
  user: LuUser,
  ticket: IoTicketOutline,
  assets: MdDevices,
  check: Check,
  chevronsUpDown: ChevronsUpDown,
  view: LuEye,
  edit: LuSquarePen,
  download: LuDownload,

  // asset types
  HARDWARE: LuCpu,         // Represents physical computing hardware
  SOFTWARE: LuCode,       // Indicates installed or locally running software
  SAAS: LuCloud,           // Represents cloud-based services (SaaS)
  OTHER: LuBox,            // A generic container/icon for miscellaneous items

  x: LuX,
}
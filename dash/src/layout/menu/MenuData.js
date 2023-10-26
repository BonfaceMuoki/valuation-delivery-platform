import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const menuadmin = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "User List - Valuers",
        link: "/admin/my-users",
      },
      {
        text: "User List - Lenders & Courts",
        link: "/admin/my-clients",
      },
      {
        text: "Valuers Requests List View",
        link: "/admin/valuers-requests",
      },
      {
        text: "Lenders & Courts Access Requests",
        link: "/admin/accesor-requests",
      },
    ],
  },
  {
    icon: "money",
    text: "Valuations",
    active: false,
    subMenu: [

      {
        text: "Reports - New Report",
        link: "/upload-new-report",
      }, {
        text: "Reports - My Reports",
        link: "/valuation-firm/my-reports",
      }, {
        text: "Reports - Comparables",
        link: "/valuation-firm/my-comparables",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Billing",
    active: false,
    subMenu: [
      {
        text: "My Credits",
        link: "valuation-firm/my-credits",
      },
      {
        text: "Make Payments",
        link: "/valuation-firm/make-payment",
      },

    ],
  },
  {
    icon: "setting",
    text: "Settings",
    active: false,
    subMenu: [
      {
        text: "Roles - Roles List",
        link: "/admin/roles",
      },
      {
        text: "Permissions - Permissions List",
        link: "/admin/permissions",
      },
      {
        text: "Roles - Role Permissions",
        link: "/admin/role-permissions",
      },
    ],
  },
];

const menulender = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "User List - Valuers",
        link: "/valuation-firm/my-users",
      },
      {
        text: "User List - Lenders & Courts",
        link: "/valuation-firm/my-clients",
      },
    ],
  },
  {
    icon: "money",
    text: "Valuations",
    active: false,
    subMenu: [
      {
        text: "Reports - My Reports",
        link: "/valuation-firm/my-reports",
      },
      {
        text: "Reports - New Report",
        link: "/valuation-firm/submit-report",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Billing",
    active: false,
    subMenu: [
      {
        text: "My Credits",
        link: "valuation-firm/my-credits",
      },
      {
        text: "Make Payments",
        link: "/valuation-firm/make-payment",
      },
    ],
  },
];
const menuvaluer = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "User List - Valuers",
        link: "/valuation-firm/my-users",
      },
      {
        text: "User List - Lenders & Courts",
        link: "/valuation-firm/my-clients",
      },
    ],
  },
  {
    icon: "money",
    text: "Valuations",
    active: false,
    subMenu: [
      {
        text: "Reports - My Reports",
        link: "/valuation-firm/my-reports",
      },
      {
        text: "Reports - New Report",
        link: "/upload-new-report",
      }, {
        text: "Reports - Comparables",
        link: "/valuation-firm/my-comparables",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Billing",
    active: false,
    subMenu: [
      {
        text: "My Credits",
        link: "valuation-firm/my-credits",
      },
      {
        text: "Make Payments",
        link: "/valuation-firm/make-payment",
      },
    ],
  },
];
const menu = { 'admin': menuadmin, 'valuer': menuvaluer, 'lender': menulender };
// const userrole = currentuser?.role_name;
// const [menu, setMenu ] = useState([]);
// setMenu(menuadmin);


// useEffect(() => {
//   if (userrole === "Super Admin") {
//     setMenu(menuadmin);
//   } else if (userrole == "Report Uploader" || userrole == "Report Uploader Admin") {
//     setMenu(menuvaluer);
//   } else if (userrole == "Report Accessor" || userrole == "Report Accessor Admin") {
//     setMenu(menulender);
//   }
// }, [userrole]);

export default menu;

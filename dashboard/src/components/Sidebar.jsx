import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  DocumentScanner,
  PublicOutlined,
  PointOfSaleOutlined,
  BuildOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  ApartmentOutlined,
  VerifiedUserOutlined,
  GradeOutlined,
  PeopleAltOutlined,
  CheckBoxOutlineBlankOutlined,
  LockClockOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.jpg";
import { selectCurrentRoles, selectCurrentPermissions, selectCurrentUser } from "scenes/auth/authSlice";
import { useSelector } from "react-redux";

const navItemsvaluer = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Valuation Reports",
    icon: null,
  },
  {
    text: "Uploaded",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Upload",
    icon: <Groups2Outlined />,
  },
  {
    text: "User Mnager",
    icon: null,
  },
  {
    text: "My Uploaders",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Accesors List",
    icon: <TodayOutlined />,
  },
  {
    text: "My Accesors",
    icon: <CalendarMonthOutlined />,
  }
];

const navItemsaccesor = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Valuation Reports",
    icon: null,
  },
  {
    text: "Uploaded",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Upload",
    icon: <Groups2Outlined />,
  },
  {
    text: "User Mnager",
    icon: null,
  },
  {
    text: "My Uploaders",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Accesors List",
    icon: <TodayOutlined />,
  },
  {
    text: "My Accesors",
    icon: <CalendarMonthOutlined />,
  }
];

const navItemsadmin = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    routeName: "/admin-dashboard"
  },
  {
    text: "Valuation Reports",
    icon: null,
    
  }, {
    text: "All",
    icon: <DocumentScanner />,
    routeName: "/all-valuation-reports"
  },
  
  {
    text: "Organizations",
    icon: null,
  },
  {
    text: "Valuation Firms",
    icon: <ApartmentOutlined />,
    routeName: "/valuation-firms"
  },
  {
    text: "Consumers",
    icon: <ApartmentOutlined />,
    routeName: "/report-consumers"
  },
  {
    text: "User Manager",
    icon: null,
  },
  {
    text: "All Users",
    icon: <GradeOutlined />,
    routeName: "/all-system-users"
  },
  {
    text: "Valuation Users",
    icon: <GradeOutlined />,
    routeName: "/valuation-firm-users"
  },
  {
    text: "Consumer Users",
    icon: <GradeOutlined />,
    routeName: "/accesors-firm-users"
  },
  {
    text: "Site Settings",
    icon: null,
  },
  {
    text: "Roles",
    icon: <PeopleAltOutlined />,
    routeName: "/roles"
  },
  {
    text: "Permissions",
    icon: <LockClockOutlined />,
    routeName: "/permissions"
  },
  {
    text: "Role Permissions",
    icon: <CheckBoxOutlineBlankOutlined />,
    routeName: "/role-permissions"
  }
];


const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const [navItems, setNavItems] = useState([]);
  const currentuser = useSelector(selectCurrentUser);

  const userrole = currentuser.role_name;

  // const issuperadin=roles.find(c=>c.name=="Super Admin");
  // const isvaluer=roles.find(c=>c.name=="Super Admin");
  // const isaccesor=roles.find(c=>c.name=="Super Admin");
  useEffect(() => {
    if (userrole === "Super Admin") {
      setNavItems(navItemsadmin);
    } else if (userrole == "Report Uploader") {
      setNavItems(navItemsvaluer);
    } else if (userrole == "Report Accessor") {
      setNavItems(navItemsaccesor);
    }
  }, [userrole]);
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    Valuation Track
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon,routeName }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = routeName;

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(lcText);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

       
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
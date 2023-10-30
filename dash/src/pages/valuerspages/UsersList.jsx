import React, { useState, useEffect } from "react";
import {
    BlockHead,
    BlockHeadContent,
    PreviewCard,
    Icon,
    UserAvatar,
    PaginationComponent,
    DataTable,
    DataTableBody,
    DataTableHead,
    DataTableRow,
    DataTableItem,
} from "../../components/Component";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card, CardHeader, CardFooter, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardLink
} from "reactstrap";

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from "react-toastify";
import { useGetPermissionsListQuery, useCreatePermissionMutation, useUpdatePermissionMutation, useDeletePermissionMutation } from "../../api/admin/adminActionsApi";
import { Row, Col } from "reactstrap";
import Select from "react-select";
import { useGetUsersQuery, useSendValuationFirmUserInviteMutation } from "../../api/commonEndPointsAPI";
import { findUpper } from "../../utils/Utils";

const CloseButton = () => {
    return (
        <span className="btn-trigger toast-close-button" role="button">
            <Icon name="cross"></Icon>
        </span>
    );
};
const UsersList = () => {
    const toastMessage = (message, type) => {
        if (type == "success") {
            toast.success(message, {
                position: "top-right",
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
                closeButton: <CloseButton />,
            });
        } else if (type == "error") {
            toast.error(message, {
                position: "top-right",
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
                closeButton: <CloseButton />,
            });
        } else if (type == "warning") {
            toast.warning(message, {
                position: "top-right",
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
                closeButton: <CloseButton />,
            });
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showModalCreatePermission, setShowModalCreatePermission] = useState(false);
    const closeCreateModal = () => {
        resetpermissionForm();
        setEditting(false);
        setEditRecord(null);
        setShowModalCreatePermission(false);
    }
    const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
    const handleCloseUserDetailsModal = () => {
        setOpenUserDetailsModal(false);
    }
    const handleOpenUserDetailsModal = () => {
        setOpenUserDetailsModal(true);
    }
    const [searchText, setSearchText] = useState("");
    const [orderColumn, setOrderColumn] = useState("permission_name");
    const [sortOrder, setSortOrder] = useState("ASC");
    const [tableData, setTableData] = useState([]);

    const [editting, setEditting] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    const {
        data: alluserslist,
        isFetching: fetchingUsers,
        isLoading: loadingUsers,
        refetch: refetchUsers,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder });
    console.log(alluserslist, "alluserslist");
    useEffect(() => {
        if (alluserslist != null && alluserslist.data) {
            setCurrentPage(alluserslist?.current_page);
            setTotalRecords(alluserslist?.total);
            setTableData(alluserslist?.data);
        } else {
            setTableData([{}]);
        }
    }, [alluserslist, searchText, refetchUsers]);

    useEffect(() => {
        if (tableData != null) {
            setCurrentItems(tableData);
        }
    }, [tableData]);
    // const currentItems = ;
    const frontendbaseurl = process.env.REACT_APP_FRONT_BASE_URL;
    // Change Page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    ///intialize invite form
    const inviteformschema = yup.object().shape({
        full_names: yup.string().required("Directors name is required"),
        login_email: yup.string().required("Login Email is required"),
        phone_number: yup.string().required("Contact Phone number is required"),
        isk_numer: yup.string().required("Directors ISK number is required"),
        vrb_numer: yup.string().required("Directors VRB number is required")
    });
    const {
        register: registerInvitForm,
        handleSubmit: handleInviteFormsubmit,
        reset: resetValuerInviteForm,
        formState: { errors: inviteFormErrors }, control } = useForm({
            resolver: yupResolver(inviteformschema)
        });
    const [inviteUploaderuser, { isLoading: sendingUploaderInvite }] = useSendValuationFirmUserInviteMutation();
    const onSubmitInviteFormsubmit = async (data) => {
        const formdata = new FormData();
        formdata.append("name", data.full_names);
        formdata.append("vrb_number", data.vrb_number);
        formdata.append("isk_number", data.isk_number);
        formdata.append("phone", data.phone_number);
        formdata.append("email", data.login_email);
        formdata.append("invited_as", data.invited_as.id);
        formdata.append("login_url", `${process.env.REACT_APP_FRONT_BASE_URL}/complete-valuer-user-registration-login`);
        formdata.append("registration_url", `${process.env.REACT_APP_FRONT_BASE_URL}/complete-valuer-user-registration-register`);
        const result = await inviteUploaderuser(formdata);
        if ('error' in result) {
            toastMessage(result.error.data.message, "error");
            if ('backendvalerrors' in result.error.data) {
                // setBackendValErrors(result.error.data.backendvalerrors);
                resetValuerInviteForm();
                setBlocked(false);
            }
        } else {
            toastMessage(result.data.message, "success");
            setBlocked(false);
        }
    }
    const getOptionLabel = (option) => {
        if (!option) {
            return ''; // Return an empty string for undefined or null options
        }
        // Handle other cases based on your data structure
        return (option.name) ? option.name : ''; // Assuming each option has a 'label' property
    };
    ///intialize invite form


    return (
        <PreviewCard style={{ height: "100%" }}>
            {/* open modal decline */}
            <Modal size="md" isOpen={openUserDetailsModal} >
                <ModalHeader
                    close={
                        <button className="close" onClick={handleCloseUserDetailsModal}>
                            <Icon name="cross" />
                        </button>
                    }
                >
                    {
                        (editting) && <span> Edit User</span>
                    }
                    {
                        (!editting) && <span> Invite User</span>
                    }
                </ModalHeader>
                <ModalBody>

                    <form onSubmit={handleInviteFormsubmit(onSubmitInviteFormsubmit)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Director of Valuation Full Names
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="default-01"
                                    {...registerInvitForm("full_names", { required: "This field is required" })}
                                    defaultValue=""
                                    placeholder="Enter your Full Names"
                                    className="form-control-lg form-control"
                                />
                                {inviteFormErrors.full_names?.message && (
                                    <span className="invalid">{inviteFormErrors.full_names?.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Account Login Email
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="default-01"
                                    {...registerInvitForm("login_email", { required: "This field is required" })}
                                    defaultValue=""
                                    placeholder="Enter your email address"
                                    className="form-control-lg form-control"
                                />
                                {inviteFormErrors.login_email?.message && (
                                    <span className="invalid">{inviteFormErrors.login_email?.message}</span>
                                )}
                            </div>
                        </div>
                        {/* <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Company Name
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="default-01"
                                    {...registerInvitForm("company_name", { required: "This field is required" })}
                                    defaultValue=""
                                    placeholder="Enter your Company Name"
                                    className="form-control-lg form-control"
                                />
                                {inviteFormErrors.company_name?.message && (
                                    <span className="invalid">{inviteFormErrors.company_name?.message}</span>
                                )}
                            </div>
                        </div> */}


                        <Row>
                            <Col>
                                {" "}
                                <div className="form-group">
                                    <div className="form-label-group">
                                        <label className="form-label" htmlFor="default-01">
                                            VRB Number
                                        </label>
                                    </div>
                                    <div className="form-control-wrap">
                                        <input
                                            type="text"
                                            id="default-01"
                                            {...registerInvitForm("directors_vrb_numer", { required: "This field is required" })}
                                            defaultValue=""
                                            placeholder="Enter Directors VRB number"
                                            className="form-control-lg form-control"
                                        />
                                        {inviteFormErrors.directors_vrb_numer?.message && (
                                            <span className="invalid">{inviteFormErrors.directors_vrb_numer?.message}</span>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                {" "}
                                <div className="form-group">
                                    <div className="form-label-group">
                                        <label className="form-label" htmlFor="default-01">
                                            ISK Number
                                        </label>
                                    </div>
                                    <div className="form-control-wrap">
                                        <input
                                            type="text"
                                            id="default-01"
                                            {...registerInvitForm("directors_isk_numer", { required: "This field is required" })}
                                            defaultValue=""
                                            placeholder="Enter your email address"
                                            className="form-control-lg form-control"
                                        />
                                        {inviteFormErrors.directors_isk_numer?.message && (
                                            <span className="invalid">{inviteFormErrors.directors_isk_numer?.message}</span>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Contact Phone Number
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="default-01"
                                    {...registerInvitForm("phone_number", { required: "This field is required" })}
                                    defaultValue=""
                                    placeholder="Enter your email address"
                                    className="form-control-lg form-control"
                                />
                                {inviteFormErrors.phone_number?.message && (
                                    <span className="invalid">{inviteFormErrors.phone_number?.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <Button size="lg" className="btn-block" type="submit" color="primary">
                                Submit
                            </Button>
                        </div>
                    </form>

                </ModalBody>
                <ModalFooter className="bg-light"></ModalFooter>

            </Modal>
            {/* close modal for decline */}
            {/* open modal decline */}

            {/* close modal for decline */}
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>Users List.</BlockHeadContent>
            </BlockHead>
            {/* <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination /> */}
            <Card className="card-bordered" style={{ marginBottom: "15px", marginTop: "15px", backgroundColor: "#F2F3F5", borderRadius: "25px" }}>
                <CardBody className="card-inner">
                    <Row>
                        <Col md="9">
                            <div id="DataTables_Table_0_filter" className="dataTables_filter">
                                <label>
                                    <input
                                        type="search"
                                        className="form-control form-control-sm"
                                        placeholder="Search by name"
                                        value={searchText}
                                        onChange={(ev) => {
                                            setCurrentPage(1);
                                            setSearchText(ev.target.value)
                                        }}
                                    />
                                </label>
                            </div>
                        </Col>
                        <Col md="1">

                            <div className="datatable-filter">
                                <div className="d-flex justify-content-end g-2">

                                    <div className="dataTables_length" id="DataTables_Table_0_length">
                                        <label>

                                            <div className="form-control-select">
                                                <select
                                                    name="DataTables_Table_0_length"
                                                    className="custom-select custom-select-sm form-control form-control-sm"
                                                    value={rowsPerPage}
                                                    onChange={(e) => setRowsPerPage(e.target.value)}
                                                >
                                                    <option value="5">5 Records</option>
                                                    <option value="10">10 Records</option>
                                                    <option value="25">25 Records</option>
                                                    <option value="40">40 Records</option>
                                                    <option value="50">50 Records</option>
                                                </select>{" "}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </Col>
                        <Col md="2" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button color="primary" className="btn-round" size="sm" type="submit" onClick={handleOpenUserDetailsModal}>
                                <Icon name="plus"></Icon>  New User
                            </Button>
                        </Col>

                    </Row>

                </CardBody>
            </Card>




            <DataTable className="card-stretch "
                sortIcon={
                    <div>
                        <span>&darr;</span>
                        <span>&uarr;</span>
                    </div>
                }


            >
                <DataTableBody>
                    <DataTableHead  >
                        <DataTableRow size="md" >
                            <span className="sub-text" onClick={() => orderBy("permission_name")} style={{ height: "60px", width: "100%", display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <strong>Permission Name</strong> &nbsp;&nbsp;&nbsp;
                                <Icon name="sort-fill" />
                            </span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="sub-text" style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}>  <strong>Email  </strong></span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="sub-text" style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}>  <strong>VRB Number  </strong></span>
                        </DataTableRow>
                        <DataTableRow size="md">
                            <span className="sub-text" style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}>  <strong>ISK Number  </strong></span>
                        </DataTableRow>
                        <DataTableRow size="md" className="nk-tb-col-tools text-end">
                            <span className="sub-text" style={{ height: "60px", width: "100%", display: "flex", alignItems: "center" }}>  <strong>Actions  </strong></span>
                        </DataTableRow>
                    </DataTableHead>
                    {/*Head*/}
                    {currentItems != undefined &&
                        currentItems != null &&
                        currentItems.length > 0 &&
                        currentItems.map((item, index) => {
                            let fullname = item?.full_name?.charAt(0).toUpperCase();
                            return (
                                <DataTableItem key={index}>
                                    <DataTableRow size="sm">
                                        <div className="user-card">
                                            <UserAvatar
                                                // theme={item.avatarBg}
                                                text={findUpper(
                                                    fullname != null && fullname != undefined
                                                        ? fullname
                                                        : "Undefined"
                                                )}
                                                image=""
                                            ></UserAvatar>
                                            <div className="user-info">
                                                <span className="tb-lead">
                                                    {item?.full_name}{" "}
                                                    <span
                                                        className={`dot dot-${item.is_active === "Active"
                                                            ? "success"
                                                            : item?.is_active === "Pending"
                                                                ? "warning"
                                                                : "danger"
                                                            } d-md-none ms-1`}
                                                    ></span>
                                                </span>
                                                <span>{item?.full_name}</span>
                                            </div>
                                        </div>

                                    </DataTableRow>
                                    <DataTableRow size="sm">
                                        {item?.email}
                                    </DataTableRow>
                                    <DataTableRow size="sm">
                                        {item?.vrb_number}
                                    </DataTableRow>
                                    <DataTableRow size="sm">
                                        {item?.isk_number}
                                    </DataTableRow>

                                    <DataTableRow size="sm" className="nk-tb-col-tools" >
                                        <ul className="nk-tb-actions gx-1" style={{ display: "flex", justifyContent: "left" }}>
                                            <li>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                                        <Icon name="more-h"></Icon>
                                                    </DropdownToggle>
                                                    <DropdownMenu end>
                                                        <ul className="link-list-opt no-bdr">
                                                            <React.Fragment>
                                                                <li onClick={() => showEditPermission(item)}>
                                                                    <DropdownItem
                                                                        tag="a"
                                                                        href="#suspend"
                                                                        onClick={(ev) => {
                                                                            ev.preventDefault();
                                                                        }}
                                                                    >
                                                                        <Icon name="edit"></Icon>
                                                                        <span>Edit</span>
                                                                    </DropdownItem>
                                                                </li>
                                                                <li className="divider" ></li>
                                                                <li onClick={() => fireDeletePermission(item)}>
                                                                    <DropdownItem
                                                                        tag="a"
                                                                        href="#suspend"
                                                                        onClick={(ev) => {
                                                                            ev.preventDefault();
                                                                        }}
                                                                    >
                                                                        <Icon name="trash"></Icon>
                                                                        <span>Delete</span>
                                                                    </DropdownItem>
                                                                </li>
                                                            </React.Fragment>
                                                        </ul>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </li>
                                        </ul>
                                    </DataTableRow>
                                </DataTableItem>
                            );
                        })
                    }
                </DataTableBody>
                <div className="card-inner">
                    {currentItems != null && currentItems != undefined ? (
                        <PaginationComponent
                            itemPerPage={rowsPerPage}
                            totalItems={totalRecords}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    ) : (
                        <div className="text-center">
                            <span className="text-silent">No data found</span>
                        </div>
                    )}
                </div>
            </DataTable>


        </PreviewCard >
    );

};
export default UsersList;

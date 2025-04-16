import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Tabs, Tab, Button, Modal, Form, Table, Spinner, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import apiClient from "../utils/apiClient";
import { toast } from "react-toastify";

const Config = () => {
  const [activeTab, setActiveTab] = useState("client");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [clients, setClients] = useState([]);
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  
  // Delete states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteSubtypes, setDeleteSubtypes] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState("");
  
  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Fetch types when component mounts
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesResponse = await apiClient.get("/config/types");
        setTypes(typesResponse.data.types);
      } catch (error) {
        console.error("Error fetching types:", error);
        toast.error("Failed to load types");
      }
    };

    fetchTypes();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case "client":
          const clientsResponse = await apiClient.get("/config/clients");
          setClients(clientsResponse.data.clients);
          break;
        case "module":
          const modulesResponse = await apiClient.get("/config/modules");
          setModules(modulesResponse.data.modules);
          break;
        case "resource":
          const resourcesResponse = await apiClient.get("/config/resource-types");
          setResources(resourcesResponse.data);
          break;
        case "type":
          const typesResponse = await apiClient.get("/config/types");
          setTypes(typesResponse.data.types);
          break;
        case "subtype":
          const subtypesResponse = await apiClient.get("/config/subtypes");
          setSubtypes(subtypesResponse.data.subtypes);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} data:`, error);
      setError(`Failed to load ${activeTab} data. Please try again later.`);
      toast.error(`Failed to load ${activeTab} data`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    setModalTitle(`Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`);
    setFormData({});
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setModalTitle(`Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`);
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      ...(activeTab === "subtype" && { typeId: item.type_id })
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (item) => {
    setDeleteItem(item);
    
    if (activeTab === "type") {
      try {
        const response = await apiClient.delete(`/config/types/${item.id}`);
        toast.success(response.data.message);
        fetchData();
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.confirmRequired) {
          setDeleteSubtypes(error.response.data.subtypes);
          setDeleteMessage("Deleting this type will also delete the following subtypes:");
          setShowDeleteModal(true);
        } else {
          console.error(`Error deleting ${activeTab}:`, error);
          toast.error(`Failed to delete ${activeTab}`);
        }
      }
    } else {
      setDeleteMessage(`Are you sure you want to delete this ${activeTab}?`);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      let endpoint = "";
      let successMessage = "";

      switch (activeTab) {
        case "type":
          endpoint = `/config/types/${deleteItem.id}/with-subtypes`;
          successMessage = "Type and associated subtypes deleted successfully";
          break;
        case "client":
          endpoint = `/config/clients/${deleteItem.id}`;
          successMessage = "Client deleted successfully";
          break;
        case "module":
          endpoint = `/config/modules/${deleteItem.id}`;
          successMessage = "Module deleted successfully";
          break;
        case "subtype":
          endpoint = `/config/subtypes/${deleteItem.id}`;
          successMessage = "Subtype deleted successfully";
          break;
        default:
          break;
      }

      if (endpoint) {
        await apiClient.delete(endpoint);
        toast.success(successMessage);
        setShowDeleteModal(false);
        fetchData();
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      toast.error(`Failed to delete ${activeTab}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint = "";
      let method = "post";
      let data = { ...formData };
      
      // Remove id from data if it exists (for create operations)
      if (data.id) {
        delete data.id;
      }
      
      switch (activeTab) {
        case "client":
          endpoint = "/config/clients";
          if (formData.id) {
            endpoint = `/config/clients/${formData.id}`;
            method = "put";
          }
          break;
        case "module":
          endpoint = "/config/modules";
          if (formData.id) {
            endpoint += `/${formData.id}`;
            method = "put";
          }
          break;
        case "resource":
          endpoint = "/config/resource-types";
          if (formData.id) {
            endpoint += `/${formData.id}`;
            method = "put";
          }
          break;
        case "type":
          endpoint = "/config/types";
          if (formData.id) {
            endpoint += `/${formData.id}`;
            method = "put";
          }
          break;
        case "subtype":
          endpoint = "/config/subtypes";
          if (formData.id) {
            endpoint += `/${formData.id}`;
            method = "put";
          }
          break;
        default:
          break;
      }
      
      if (method === "post") {
        await apiClient.post(endpoint, data);
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} created successfully`);
      } else {
        await apiClient.put(endpoint, data);
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} updated successfully`);
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'creating'} ${activeTab}:`, error);
      toast.error(`Failed to ${formData.id ? 'update' : 'create'} ${activeTab}`);
    }
  };

  const renderTable = () => {
    let data = [];
    let columns = [];

    switch (activeTab) {
      case "client":
        data = clients || [];
        columns = [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" }
        ];
        break;
      case "module":
        data = modules || [];
        columns = [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" }
        ];
        break;
      case "resource":
        data = resources || [];
        columns = [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" }
        ];
        break;
      case "type":
        data = types || [];
        columns = [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" }
        ];
        break;
      case "subtype":
        data = subtypes || [];
        columns = [
          { key: "name", label: "Name" },
          { key: "type_name", label: "Type" },
          { key: "description", label: "Description" }
        ];
        break;
      default:
        break;
    }

    if (isLoading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      );
    }
    
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">No {activeTab} found</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.key}>{item[column.key]}</td>
                ))}
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(item)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(item)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Configuration</h2>
        <Button variant="primary" onClick={handleAddClick}>
          <FaPlus className="me-2" />
          Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="mb-4"
      >
        <Tab eventKey="client" title="Client">
          {renderTable()}
        </Tab>
        <Tab eventKey="module" title="Module">
          {renderTable()}
        </Tab>
        <Tab eventKey="resource" title="Resource">
          {renderTable()}
        </Tab>
        <Tab eventKey="type" title="Type">
          {renderTable()}
        </Tab>
        <Tab eventKey="subtype" title="Subtype">
          {renderTable()}
        </Tab>
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            {activeTab === "subtype" && (
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="typeId"
                  value={formData.typeId || ""}
                  onChange={handleInputChange}
                  required
                  className={!formData.typeId ? "is-invalid" : ""}
                >
                  <option value="" disabled>Select a type</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
                {!formData.typeId && (
                  <Form.Control.Feedback type="invalid">
                    Please select a type
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {formData.id ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeTab === "type" && deleteSubtypes.length > 0 ? (
            <Alert variant="warning">
              <h5>Warning!</h5>
              <p>{deleteMessage}</p>
              <ul className="mb-0">
                {deleteSubtypes.map((subtype) => (
                  <li key={subtype.id}>{subtype.name}</li>
                ))}
              </ul>
            </Alert>
          ) : (
            <Alert variant="warning">
              <h5>Warning!</h5>
              <p>{deleteMessage}</p>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Config; 
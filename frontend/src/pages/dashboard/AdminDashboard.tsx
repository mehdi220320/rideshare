import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { FaCar, FaUsers, FaChartLine, FaCog, FaUserPlus, FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeRides: 58,
    monthlyRevenue: 12540,
    completedTrips: 342
  });
  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joined: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', joined: '2024-01-13' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', joined: '2024-01-12' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', joined: '2024-01-11' },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated and has correct role
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const userRole = authService.getUserRole();
    if (userRole !== 'admin') {
      navigate('/dashboard');
    }
    
    fetchAdminStats();
  }, [navigate]);

  const fetchAdminStats = async () => {
    // Here you would fetch real data from your API
    // For now using mock data
    try {
      // const usersData = await adminService.getUsers();
      // const tripsData = await adminService.getAllTrips();
      // Update stats with real data
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  const adminEmail = localStorage.getItem('userEmail');
  const adminName = localStorage.getItem('userName') || 'Admin';

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'success',
      pending: 'warning',
      inactive: 'secondary',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Menu Button */}
      <Button
        variant="dark"
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 998,
          borderRadius: '10px',
        }}
      >
        ☰ Menu
      </Button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div style={{ 
        marginLeft: sidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
        padding: '20px'
      }}>
        <Container fluid className="py-4">
          {/* Welcome Section */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="display-5 fw-bold">Admin Dashboard</h1>
                  <p className="lead text-muted">Welcome back, {adminName}!</p>
                </div>
                <div className="d-none d-md-block">
                  <div className="bg-danger rounded-circle p-3 shadow-sm">
                    <FaUsers size={30} color="white" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="g-4 mb-5">
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="bg-primary rounded-circle d-inline-flex p-3 mb-3">
                    <FaUsers size={24} color="white" />
                  </div>
                  <h6 className="text-muted">Total Users</h6>
                  <h2 className="display-4 fw-bold">{stats.totalUsers.toLocaleString()}</h2>
                  <small className="text-success">↑ 12% this month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="bg-success rounded-circle d-inline-flex p-3 mb-3">
                    <FaCar size={24} color="white" />
                  </div>
                  <h6 className="text-muted">Active Rides</h6>
                  <h2 className="display-4 fw-bold">{stats.activeRides}</h2>
                  <small className="text-success">↑ 8% this week</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="bg-info rounded-circle d-inline-flex p-3 mb-3">
                    <FaChartLine size={24} color="white" />
                  </div>
                  <h6 className="text-muted">Monthly Revenue</h6>
                  <h2 className="display-4 fw-bold">${stats.monthlyRevenue.toLocaleString()}</h2>
                  <small className="text-success">↑ 23% from last month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="bg-warning rounded-circle d-inline-flex p-3 mb-3">
                    <FaCalendarAlt size={24} color="white" />
                  </div>
                  <h6 className="text-muted">Completed Trips</h6>
                  <h2 className="display-4 fw-bold">{stats.completedTrips}</h2>
                  <small className="text-success">This month</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mb-5">
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold py-3">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={3}>
                      <Button variant="danger" className="w-100 py-2">
                        <FaUserPlus className="me-2" /> Create Admin User
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button variant="outline-danger" className="w-100 py-2">
                        <FaEye className="me-2" /> View All Users
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button variant="outline-danger" className="w-100 py-2">
                        <FaCar className="me-2" /> Manage Trips
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button variant="outline-secondary" className="w-100 py-2">
                        <FaCog className="me-2" /> System Settings
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Users Table */}
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Users</h5>
                  <Button variant="link" className="text-danger p-0">View All →</Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="fw-semibold">{user.name}</td>
                          <td>{user.email}</td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td>{user.joined}</td>
                          <td>
                            <Button variant="link" size="sm" className="text-info p-0 me-2">
                              <FaEye />
                            </Button>
                            <Button variant="link" size="sm" className="text-warning p-0 me-2">
                              <FaEdit />
                            </Button>
                            <Button variant="link" size="sm" className="text-danger p-0">
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Activity & Statistics */}
            <Col lg={4}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white fw-bold py-3">
                  <h5 className="mb-0">Platform Overview</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>User Growth</span>
                      <span className="fw-bold">+23%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Trip Completion Rate</span>
                      <span className="fw-bold">94%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>User Satisfaction</span>
                      <span className="fw-bold">4.8/5</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-info" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-center">
                    <h6 className="text-muted">System Status</h6>
                    <Badge bg="success" className="fs-6">All Systems Operational</Badge>
                  </div>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold py-3">
                  <h5 className="mb-0">Admin Info</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <div className="bg-dark rounded-circle d-inline-flex p-3 mb-2">
                      <FaUsers size={30} color="white" />
                    </div>
                    <h6 className="mb-1">{adminEmail}</h6>
                    <small className="text-muted">Administrator</small>
                  </div>
                  <hr />
                  <div className="small text-muted">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Last Login:</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Account Type:</span>
                      <span className="text-danger">Super Admin</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
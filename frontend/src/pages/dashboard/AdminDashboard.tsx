import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { FaCheckCircle, FaCar, FaUsers, FaChartLine, FaCog, FaUserPlus, FaEye, FaTrash, FaEdit, FaCalendarAlt, FaArrowLeft, FaShieldAlt, FaRocket, FaUserCheck } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const AdminDashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    try {
      // Here you would fetch real data from your API
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  const adminEmail = localStorage.getItem('userEmail');
  const adminName = localStorage.getItem('userName') || 'Admin';

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'danger',
      pending: 'warning',
      inactive: 'secondary',
    };
    const icons: Record<string, string> = {
      active: '✅',
      pending: '⏳',
      inactive: '⭕',
    };
    return (
      <Badge bg={variants[status] || 'secondary'} className="px-3 py-2">
        {icons[status]} {status.toUpperCase()}
      </Badge>
    );
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarWidth = isSidebarCollapsed ? '80px' : '260px';

  return (
    <div style={{ minHeight: '100vh', background: '#000000' }}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div style={{ 
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s ease-in-out',
        padding: '30px',
        minHeight: '100vh',
        background: '#f5f5f5'
      }}>
        <Container fluid className="py-4">
          {/* Welcome Section */}
          <div className="mb-4">
            <Button
              variant="link"
              onClick={() => navigate('/dashboard')}
              className="mb-3 text-decoration-none"
              style={{ color: '#dc3545' }}
            >
              <FaArrowLeft className="me-2" /> Back to Main Site
            </Button>
          </div>

          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold" style={{ color: '#000000' }}>Admin Dashboard</h1>
                  <p className="lead text-muted">Welcome back, {adminName}!</p>
                </div>
                <div className="d-none d-md-block">
                  <div className="rounded-circle p-3 shadow-sm" style={{ background: '#dc3545' }}>
                    <FaShieldAlt size={30} color="white" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Statistics Cards - Black and Red Theme */}
          <Row className="g-4 mb-5">
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: '#000000', color: 'white' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="rounded-circle p-2 mb-3 d-inline-flex" style={{ background: '#dc3545' }}>
                        <FaUsers size={20} color="white" />
                      </div>
                      <h6 className="text-white-50 mb-2">Total Users</h6>
                      <h2 className="display-4 fw-bold mb-0">{stats.totalUsers.toLocaleString()}</h2>
                      <small className="text-white-50">↑ 12% this month</small>
                    </div>
                    <FaRocket size={40} className="opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: '#dc3545', color: 'white' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="rounded-circle p-2 mb-3 d-inline-flex" style={{ background: '#ffffff', color: '#dc3545' }}>
                        <FaCar size={20} color="#dc3545" />
                      </div>
                      <h6 className="text-white-50 mb-2">Active Rides</h6>
                      <h2 className="display-4 fw-bold mb-0">{stats.activeRides}</h2>
                      <small className="text-white-50">↑ 8% this week</small>
                    </div>
                    <FaCar size={40} className="opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: '#1a1a1a', color: 'white' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="rounded-circle p-2 mb-3 d-inline-flex" style={{ background: '#dc3545' }}>
                        <FaChartLine size={20} color="white" />
                      </div>
                      <h6 className="text-white-50 mb-2">Monthly Revenue</h6>
                      <h2 className="display-4 fw-bold mb-0">${stats.monthlyRevenue.toLocaleString()}</h2>
                      <small className="text-white-50">↑ 23% from last month</small>
                    </div>
                    <FaChartLine size={40} className="opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: '#000000', color: 'white' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="rounded-circle p-2 mb-3 d-inline-flex" style={{ background: '#dc3545' }}>
                        <FaCalendarAlt size={20} color="white" />
                      </div>
                      <h6 className="text-white-50 mb-2">Completed Trips</h6>
                      <h2 className="display-4 fw-bold mb-0">{stats.completedTrips}</h2>
                      <small className="text-white-50">This month</small>
                    </div>
                    <FaCalendarAlt size={40} className="opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mb-5">
            <Col>
              <Card className="shadow-sm border-0" style={{ borderRadius: '20px' }}>
                <Card.Header className="fw-bold py-3" style={{ backgroundColor: '#000000', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-3">
                    <Col lg={3} md={6}>
                      <Button variant="danger" className="w-100 py-3" style={{ borderRadius: '12px', fontWeight: '600' }}>
                        <FaUserPlus className="me-2" /> Create Admin User
                      </Button>
                    </Col>
                    <Col lg={3} md={6}>
                      <Button variant="outline-danger" className="w-100 py-3" style={{ borderRadius: '12px', fontWeight: '600' }}>
                        <FaEye className="me-2" /> View All Users
                      </Button>
                    </Col>
                    <Col lg={3} md={6}>
                      <Button variant="outline-danger" className="w-100 py-3" style={{ borderRadius: '12px', fontWeight: '600' }}>
                        <FaCar className="me-2" /> Manage Trips
                      </Button>
                    </Col>
                    <Col lg={3} md={6}>
                      <Button variant="outline-secondary" className="w-100 py-3" style={{ borderRadius: '12px', fontWeight: '600' }}>
                        <FaCog className="me-2" /> System Settings
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Users and Platform Overview */}
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shadow-sm border-0" style={{ borderRadius: '20px' }}>
                <Card.Header className="fw-bold py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#000000', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <h5 className="mb-0">Recent Users</h5>
                  <Button variant="link" className="text-danger p-0 text-decoration-none">View All →</Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
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
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '20px' }}>
                <Card.Header className="fw-bold py-3" style={{ backgroundColor: '#000000', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <h5 className="mb-0">Platform Overview</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">User Growth</span>
                      <span className="fw-bold text-danger">+23%</span>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '78%', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Trip Completion Rate</span>
                      <span className="fw-bold text-danger">94%</span>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '94%', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">User Satisfaction</span>
                      <span className="fw-bold text-danger">4.8/5</span>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '96%', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-center">
                    <h6 className="text-muted mb-2">System Status</h6>
                    <Badge bg="danger" className="px-3 py-2 fs-6">
                      <FaCheckCircle className="me-1" /> All Systems Operational
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0" style={{ borderRadius: '20px' }}>
                <Card.Header className="fw-bold py-3" style={{ backgroundColor: '#000000', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <h5 className="mb-0">Admin Info</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-3">
                    <div className="rounded-circle d-inline-flex p-3 mb-2" style={{ width: '70px', height: '70px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#dc3545' }}>
                      <FaUserCheck size={35} color="white" />
                    </div>
                    <h6 className="mb-1 fw-bold">{adminEmail}</h6>
                    <Badge bg="danger" className="mt-1">Administrator</Badge>
                  </div>
                  <hr />
                  <div className="small">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Last Login:</span>
                      <span className="fw-semibold">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Account Type:</span>
                      <span className="text-danger fw-bold">Super Admin</span>
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
import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Divider, Chip, Stack, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import WcIcon from '@mui/icons-material/Wc';
import ClassIcon from '@mui/icons-material/Class';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api';

// Stacked bar chart for male/female counts per class
function StackedBarChart({ data = [], height = 260 }) {
  if (!data || data.length === 0) {
    return <Typography variant="body2">No class data available</Typography>;
  }

  // compute max total to scale bars
  const max = Math.max(...data.map((d) => d.totalCount || ((d.maleCount || 0) + (d.femaleCount || 0))), 1);
  const barWidth = Math.max(24, Math.floor(700 / data.length));
  const viewWidth = data.length * barWidth;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${viewWidth} ${height}`}>
      {data.map((d, i) => {
        const total = d.totalCount != null ? d.totalCount : ((d.maleCount || 0) + (d.femaleCount || 0));
        const male = d.maleCount || 0;
        const female = d.femaleCount || 0;
        const totalBarHeight = (total / max) * (height - 60);
        const maleBarHeight = (male / max) * (height - 60);
        const femaleBarHeight = (female / max) * (height - 60);

        const x = i * barWidth + 10;
        const columnWidth = barWidth - 20;
        const yTop = height - totalBarHeight - 30;

        return (
          <g key={d.className}>
            {/* female segment (bottom) */}
            <rect x={x} y={yTop + maleBarHeight} width={columnWidth} height={femaleBarHeight} fill="#e57373" rx="4">
              <title>{`Female: ${female}`}</title>
            </rect>

            {/* male segment (top) */}
            <rect x={x} y={yTop} width={columnWidth} height={maleBarHeight} fill="#42a5f5" rx="4">
              <title>{`Male: ${male}`}</title>
            </rect>

            <text x={x + columnWidth / 2} y={height - 12} fontSize="11" textAnchor="middle">
              {d.className}
            </text>

            {/* total label above column */}
            <text x={x + columnWidth / 2} y={yTop - 6} fontSize="10" textAnchor="middle">
              {total}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Donut chart removed per request (gender distribution card removed)

function StatCard({ title, value, icon, accent }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: accent, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user, school } = useAuth();
  const [classData, setClassData] = useState([]);
  const [genderData, setGenderData] = useState({ male: 0, female: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      // Try to use provided `school` object if it contains precomputed stats
      if (school && school.studentSummary) {
        const s = school.studentSummary;
        if (mounted) {
          setClassData(s.byClass || []);
          setGenderData({ male: s.male || 0, female: s.female || 0 });
          setLoading(false);
        }
        return;
      }

      // Try to fetch summary from backend (dashboard controller endpoints)
      // Prefer class-wise and school-wise aggregated endpoints.
      try {
        const [classRes, schoolRes] = await Promise.allSettled([
          apiGet('api/dashboard/class-student-count'),
          apiGet('api/dashboard/school-student-count'),
        ]);

        let byClass = [];
        let gender = { male: 0, female: 0 };

        if (classRes.status === 'fulfilled' && Array.isArray(classRes.value)) {
          // Expecting [{ className: '1', maleCount: X, femaleCount: Y, totalCount: Z }, ...]
          byClass = classRes.value.map((r) => ({
            className: String(r.className || r.class_name || r.name || r.class || 'Unknown'),
            maleCount: r.maleCount != null ? r.maleCount : (r.male_count != null ? r.male_count : 0),
            femaleCount: r.femaleCount != null ? r.femaleCount : (r.female_count != null ? r.female_count : 0),
            totalCount: r.totalCount != null ? r.totalCount : (r.total_count != null ? r.total_count : ((r.maleCount || r.male_count || 0) + (r.femaleCount || r.female_count || 0))),
          }));
        }

        if (schoolRes.status === 'fulfilled' && schoolRes.value) {
          const g = schoolRes.value;
          gender = {
            male: g.maleCount != null ? g.maleCount : (g.male_count != null ? g.male_count : (g.male || 0)),
            female: g.femaleCount != null ? g.femaleCount : (g.female_count != null ? g.female_count : (g.female || 0)),
          };
        }

        // If both empty, fallback to sample grouping using a generic endpoint that returns list of students
        if (byClass.length === 0 && (gender.male + gender.female) === 0) {
          try {
            const students = await apiGet('api/students');
            if (Array.isArray(students)) {
              const map = {};
              let male = 0;
              let female = 0;
              students.forEach((st) => {
                const cls = st.class || st.className || st.std || 'Unknown';
                map[cls] = (map[cls] || 0) + 1;
                const g = (st.gender || '').toLowerCase();
                if (g === 'male' || g === 'm') male++;
                else if (g === 'female' || g === 'f') female++;
              });
              byClass = Object.keys(map).sort().map((k) => ({ className: k, maleCount: 0, femaleCount: 0, totalCount: map[k] }));
              gender = { male, female };
            }
          } catch (e) {
            // ignore
          }
        }


        if (mounted) {
          setClassData(byClass);
          setGenderData(gender);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading dashboard stats', err);
        if (mounted) {
          // Keep empty state if backend fails — frontend will show appropriate messages
          setClassData([]);
          setGenderData({ male: 0, female: 0 });
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [school]);

  const totalStudents = (genderData.male || 0) + (genderData.female || 0);
  const classCount = classData.length;

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={totalStudents} icon={<SchoolIcon />} accent="#2563eb" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Male Students" value={genderData.male || 0} icon={<GroupIcon />} accent="#0ea5e9" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Female Students" value={genderData.female || 0} icon={<WcIcon />} accent="#ec4899" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Classes" value={classCount} icon={<ClassIcon />} accent="#7c3aed" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Students by Class</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visual breakdown of class-wise student strength
                  </Typography>
                </Box>
                <Chip label={`${classCount} classes`} size="small" />
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#42a5f5', borderRadius: '50%' }} />
                  <Typography variant="body2">Male</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#e57373', borderRadius: '50%' }} />
                  <Typography variant="body2">Female</Typography>
                </Box>
              </Box>
              <Box sx={{ width: '100%', overflowX: 'auto', p: 1, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                {loading ? (
                  <Typography color="text.secondary">Loading...</Typography>
                ) : (
                  <StackedBarChart data={classData} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gender distribution card removed */}
      </Grid>
    </Container>
  );
}

export default Dashboard;

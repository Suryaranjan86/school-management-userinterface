import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api';

// Small, dependency-free BarChart component (SVG)
function BarChart({ data = [], height = 220 }) {
  if (!data || data.length === 0) {
    return <Typography variant="body2">No class data available</Typography>;
  }

  const max = Math.max(...data.map((d) => d.count), 1);
  const barWidth = Math.max(12, Math.floor(600 / data.length));

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${data.length * barWidth} ${height}`}>
      {data.map((d, i) => {
        const barHeight = (d.count / max) * (height - 40);
        const x = i * barWidth + 10;
        const y = height - barHeight - 20;
        return (
          <g key={d.className}>
            <rect x={x} y={y} width={barWidth - 20} height={barHeight} fill="#1976d2" rx="4" />
            <text x={x + (barWidth - 20) / 2} y={height - 6} fontSize="10" textAnchor="middle">
              {d.className}
            </text>
            <text x={x + (barWidth - 20) / 2} y={y - 6} fontSize="11" textAnchor="middle">
              {d.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Simple donut chart using stroke-dasharray
function DonutChart({ values = { male: 0, female: 0 }, size = 160 }) {
  const total = (values.male || 0) + (values.female || 0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const maleFraction = total === 0 ? 0 : (values.male || 0) / total;
  const maleLength = maleFraction * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {/* Background circle */}
        <circle r={radius} fill="#f5f5f5" />
        {/* Female (background for male) */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#e57373"
          strokeWidth={18}
          strokeDasharray={`${circumference - maleLength} ${maleLength}`}
          transform={`rotate(-90)`}
        />
        {/* Male */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#42a5f5"
          strokeWidth={18}
          strokeDasharray={`${maleLength} ${circumference - maleLength}`}
          strokeLinecap="round"
          transform={`rotate(-90)`}
        />
        <text y="6" textAnchor="middle" fontSize="14" fontWeight={700}>
          {total}
        </text>
      </g>
    </svg>
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

      // Try to fetch summary from backend. Multiple endpoints are attempted so the UI works
      // with different backend implementations. If none succeed, fallback to sample data.
      try {
        // Example expected endpoints (adjust if your backend differs)
        const [byClassRes, genderRes] = await Promise.allSettled([
          apiGet('api/students/by-class'),
          apiGet('api/students/gender-summary'),
        ]);

        let byClass = [];
        let gender = { male: 0, female: 0 };

        if (byClassRes.status === 'fulfilled' && Array.isArray(byClassRes.value)) {
          // Expecting [{ className: '1', count: 120 }, ...]
          byClass = byClassRes.value.map((r) => ({ className: String(r.className || r.name || r.class), count: r.count || r.value || 0 }));
        }

        if (genderRes.status === 'fulfilled' && genderRes.value) {
          // Could be { male: X, female: Y }
          const g = genderRes.value;
          gender = { male: g.male || g.Male || 0, female: g.female || g.Female || 0 };
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
              byClass = Object.keys(map).sort().map((k) => ({ className: k, count: map[k] }));
              gender = { male, female };
            }
          } catch (e) {
            // ignore
          }
        }

        // Do not use hard-coded fallback values here; return whatever the backend provides.

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

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Students by Class</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <BarChart data={classData} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">Male / Female</Typography>
              <Divider sx={{ width: '100%', my: 1 }} />
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                <>
                  <DonutChart values={genderData} />
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#42a5f5' }} />
                      <Typography variant="body2">Male: {genderData.male}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#e57373' }} />
                      <Typography variant="body2">Female: {genderData.female}</Typography>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;

import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../lib/withAuth';

type DailyRevenue = {
  _id: string; 
  totalRevenue: number;
  orderCount: number;
};

type CategorySales = {
  _id: string; 
  totalSold: number;
  revenue: number;
};

function Reports() {
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [revenueRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:5000/api/reports/revenue/daily'),
          axios.get('http://localhost:5000/api/reports/sales/category'),
        ]);

        setDailyRevenue(revenueRes.data);
        setCategorySales(categoryRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Reports</h1>

      
      <section style={{ marginTop: '2rem' }}>
        <h2>Daily Revenue (Last 7 Days)</h2>
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Revenue</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {dailyRevenue.map((entry) => (
              <tr key={entry._id}>
                <td>{entry._id}</td>
                <td>₹{entry.totalRevenue}</td>
                <td>{entry.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

     
      <section style={{ marginTop: '2rem' }}>
        <h2>Sales by Category</h2>
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {categorySales.map((entry) => (
              <tr key={entry._id}>
                <td>{entry._id}</td>
                <td>{entry.totalSold}</td>
                <td>₹{entry.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default withAuth(Reports);

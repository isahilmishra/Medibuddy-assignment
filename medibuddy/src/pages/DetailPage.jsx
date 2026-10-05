import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(location.state?.medicineData || null);
  const [loading, setLoading] = useState(!location.state?.medicineData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      return;
    }

    const fetchMedicineDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=id:"${id}"`);
        if (!response.ok) {
          throw new Error('Medicine not found or API error');
        }
        const result = await response.json();
        if (result.results && result.results.length > 0) {
          setData(result.results[0]);
        } else {
          throw new Error('Medicine not found');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load medicine details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id, data]);

  if (loading) {
    return (
      <div>
        <Link to="/" className="back-button">Back to Search</Link>
        <div className="loading-state">
          <p>Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Link to="/" className="back-button">Back to Search</Link>
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || 'Medicine not found'}</p>
        </div>
      </div>
    );
  }

  const openfda = data.openfda || {};
  const brandName = (openfda.brand_name && openfda.brand_name[0]) || 'Unknown Brand';
  const genericName = (openfda.generic_name && openfda.generic_name[0]) || 'N/A';
  
  const warnings = data.warnings && data.warnings[0];
  const indications = data.indications_and_usage && data.indications_and_usage[0];
  const dosage = data.dosage_and_administration && data.dosage_and_administration[0];
  const activeIngredient = data.active_ingredient && data.active_ingredient[0];
  const purpose = data.purpose && data.purpose[0];

  return (
    <div>
      <Link to="/" className="back-button">Back to Search</Link>
      
      <div className="detail-page">
        <div className="detail-header">
          <h1>{brandName}</h1>
          <p className="card-subtitle">{genericName}</p>
          
          <div style={{ marginTop: '16px' }}>
            {openfda.product_type && openfda.product_type.map(type => (
              <span key={type} className="badge">{type}</span>
            ))}
            {openfda.route && openfda.route.map(r => (
              <span key={r} className="badge">{r}</span>
            ))}
          </div>
        </div>
        
        {openfda.manufacturer_name && (
          <div className="detail-section">
            <h3>Manufacturer</h3>
            <p>{openfda.manufacturer_name[0]}</p>
          </div>
        )}

        {activeIngredient && (
          <div className="detail-section">
            <h3>Active Ingredient</h3>
            <p>{activeIngredient}</p>
          </div>
        )}

        {purpose && (
          <div className="detail-section">
            <h3>Purpose</h3>
            <p>{purpose}</p>
          </div>
        )}

        {indications && (
          <div className="detail-section">
            <h3>Indications and Usage</h3>
            <p>{indications}</p>
          </div>
        )}

        {dosage && (
          <div className="detail-section">
            <h3>Dosage and Administration</h3>
            <p>{dosage}</p>
          </div>
        )}

        {warnings && (
          <div className="detail-section">
            <h3>Warnings</h3>
            <p>{warnings}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage;


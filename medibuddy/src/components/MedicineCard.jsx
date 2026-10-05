import { useNavigate } from 'react-router-dom';

function MedicineCard({ data, id }) {
  const navigate = useNavigate();
  const openfda = data.openfda || {};
  
  const brandName = (openfda.brand_name && openfda.brand_name[0]) || 'Unknown Brand';
  const genericName = (openfda.generic_name && openfda.generic_name[0]) || 'N/A';
  const manufacturer = (openfda.manufacturer_name && openfda.manufacturer_name[0]) || 'N/A';
  const productType = (openfda.product_type && openfda.product_type[0]) || 'N/A';
  const route = (openfda.route && openfda.route.join(', ')) || 'N/A';

  const handleClick = () => {
    navigate(`/medicine/${id}`, { state: { medicineData: data } });
  };

  return (
    <div className="card" onClick={handleClick}>
      <h2>{brandName}</h2>
      <div className="card-subtitle">{genericName}</div>
      <div className="detail-row">
        <span className="detail-label">Manufacturer: </span>
        <span>{manufacturer}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Product Type: </span>
        <span>{productType}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Route: </span>
        <span>{route}</span>
      </div>
    </div>
  );
}

export default MedicineCard;


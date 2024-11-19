import React, { useState } from "react";

const initialRows = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1400,
    originalValue: 1400,
    children: [
      { id: "phones", label: "Phones", value: 800, originalValue: 800 },
      { id: "laptops", label: "Laptops", value: 700, originalValue: 700 },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000,
    originalValue: 1000,
    children: [
      { id: "tables", label: "Tables", value: 300, originalValue: 300 },
      { id: "chairs", label: "Chairs", value: 700, originalValue: 700 },
    ],
  },
];

function App() {
  const [rows, setRows] = useState(initialRows);

  const updateRows = (rows, id, newValue, isPercentage = false) => {
    return rows.map((row) => {
      if (row.id === id) {
        const updatedValue = isPercentage
          ? row.value + (row.value * newValue) / 100
          : newValue;

        return { ...row, value: updatedValue };
      }
      if (row.children) {
        const updatedChildren = updateRows(row.children, id, newValue, isPercentage);
        const parentValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
        return { ...row, children: updatedChildren, value: parentValue };
      }
      return row;
    });
  };

  
  const handleUpdate = (id, input, isPercentage) => {
    const inputValue = parseFloat(input);
    if (!isNaN(inputValue)) {
      setRows((prevRows) => updateRows(prevRows, id, inputValue, isPercentage));
    }
  };


  const renderVariance = (value, originalValue) => {
    const variance = ((value - originalValue) / originalValue) * 100;
    return `${variance.toFixed(2)}%`;
  };

  
  const renderRows = (rows) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <tr>
          <td>{row.label}</td>
          <td>{row.value.toFixed(2)}</td>
          <td>
            <input type="number" id={`input-${row.id}`} />
          </td>
          <td>
            <button
              onClick={() =>
                handleUpdate(
                  row.id,
                  document.getElementById(`input-${row.id}`).value,
                  true
                )
              }
            >
              Allocation %
            </button>
          </td>
          <td>
            <button
              onClick={() =>
                handleUpdate(
                  row.id,
                  document.getElementById(`input-${row.id}`).value,
                  false
                )
              }
            >
              Allocation Val
            </button>
          </td>
          <td>{renderVariance(row.value, row.originalValue)}</td>
        </tr>
        {row.children && renderRows(row.children)}
      </React.Fragment>
    ));
  };


  const calculateGrandTotal = (rows) => {
    return rows.reduce((total, row) => total + row.value, 0).toFixed(2);
  };

  return (
    <div className="App">
      <h1>Hierarchical Table</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {renderRows(rows)}
          <tr>
            <td><b>Grand Total</b></td>
            <td><b>{calculateGrandTotal(rows)}</b></td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;

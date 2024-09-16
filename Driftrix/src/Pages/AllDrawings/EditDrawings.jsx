import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"; 
import WhiteBoardComponent from "../../Components/WhiteBoardComponent";
import { Helmet } from "react-helmet-async";

const EditDrawings = () => {
  const { id } = useParams(); 
  const location = useLocation(); 
  const [drawingData, setDrawingData] = useState(location.state?.drawing || {}); 



  // Handle the update save
  const handleUpdate = async (updatedDrawing) => {
    try {
      const response = await fetch(`http://localhost:4000/drawings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDrawing),
      });

      if (response.ok) {
        alert("Drawing updated successfully!");
      } else {
        alert("Failed to update drawing.");
      }
    } catch (error) {
      console.error("Error updating drawing:", error);
    }
  };

  return (
    <div className="p-6 mx-32">
        <Helmet>
        <title>Draftrix - Edit Drawings</title>
      </Helmet>
      <h2 className="text-lg md:text-xl lg:text-3xl font-bold text-center mb-4">Edit Drawing</h2>
      
      {/*  WhiteBoardComponent for editing */}
      {drawingData && (
        <WhiteBoardComponent 
          drawing={drawingData} 
          onSave={handleUpdate} 
          showUpdateButton={true} 
        />
      )}
    </div>
  );
};

export default EditDrawings;
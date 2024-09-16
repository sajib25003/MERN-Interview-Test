import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const AllDrawings = () => {
  const [drawings, setDrawings] = useState([]);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const response = await fetch("https://draftrix-server.vercel.app/drawings");
        const data = await response.json();
        setDrawings(data);
      } catch (error) {
        console.error("Error fetching drawings:", error);
      }
    };

    fetchDrawings();
  }, []);

  const openModal = async (drawingId) => {
    try {
      const response = await fetch(
        `https://draftrix-server.vercel.app/drawings/${drawingId}`
      );
      const data = await response.json();
      setSelectedDrawing(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching drawing by ID:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDrawing(null);
  };

  const deleteDrawing = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this drawing?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://draftrix-server.vercel.app/drawings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Drawing deleted successfully!");
        setDrawings((prevDrawings) =>
          prevDrawings.filter((drawing) => drawing._id !== id)
        );
        setIsModalOpen(false);
      } else {
        alert("Failed to delete drawing.");
      }
    } catch (error) {
      console.error("Error deleting drawing:", error);
    }
  };

  const handleEdit = () => {
    if (selectedDrawing) {
      navigate(`/edit/${selectedDrawing._id}`, {
        state: { drawing: selectedDrawing },
      });
    }
  };

  return (
    <div className="p-6 mx-2 md:mx-10 lg:mx-32">
      <Helmet>
        <title>Draftrix - All Drawings</title>
      </Helmet>
      <div className="pt-4 pb-6">
        <h2 className="text-black text-lg md:text-xl lg:text-3xl font-bold text-center">
          All Drawings
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drawings.map((drawing) => (
          <div
            key={drawing._id}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer p-4"
          >
            <img
              src={drawing.image}
              alt={drawing.drawingName}
              onClick={() => openModal(drawing._id)}
              className="w-full border rounded-lg h-40 object-cover shadow-xl"
            />
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{drawing.drawingName}</h3>
              <p className="text-gray-500">By {drawing.authorName}</p>
              <button
                onClick={() => deleteDrawing(drawing._id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show individual drawing in modal */}
      {isModalOpen &&
        selectedDrawing && ( 
          <dialog open className="modal bg-gray-300 bg-opacity-80">
            <div className="modal-box w-4/5 max-w-5xl h-1/3 md:h-2/5 lg:h-4/5 bg-green-50">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeModal}
              >
                ✕
              </button>
              <div className="bg-white text-black p-2 pb-8 md:p-6 rounded shadow-lg h-full">
                <img
                  src={selectedDrawing.image}
                  alt={selectedDrawing.drawingName}
                  className="w-full border rounded-lg shadow-xl h-[90%] object-cover mb-4"
                />
                <div className="flex justify-between items-center ">
                  <h2 className=" text-sm md:text-lg font-bold md:mb-2">
                    {selectedDrawing.drawingName}
                  </h2>
                  <p className="text-gray-500 hidden md:flex">
                    By {selectedDrawing.authorName}
                  </p>
                  <button
                    onClick={handleEdit}
                    className=" bg-blue-500 text-white px-4 sm:py-1 md:py-2 rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}
    </div>
  );
};

export default AllDrawings;

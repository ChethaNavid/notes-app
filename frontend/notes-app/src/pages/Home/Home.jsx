import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd, MdOutlineAlarmAdd } from 'react-icons/md';
import AddEditNote from './AddEditNote';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useEffect } from 'react';
import ToastMsg from '../../components/ToastMessage/ToastMsg';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import addNoteImg from '../../assets/add-note.svg';
import noNoteImg from '../../assets/no-data.svg';

const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        type:"add",
        message: "",
    });
    const [userInfo, setUserInfo] = useState(null);
    const [allNotes, setAllNotes] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();

    const handleEditNote = (noteDetails) => {
        setOpenAddEditModal({
            isShown: true,
            type: "edit",
            data: noteDetails,
        });
    }

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        })
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        })
    };

    //Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/users/get-user");
            if(response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch(error) {
            if(error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }

    // Get All Notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/notes/get-all-note");
            if(response.data && response.data.note) {
                setAllNotes(response.data.note);
            }
        } catch (error) {
            console.log("Unexpected error occurred.");
        }
    }

    useEffect(() => {
      getUserInfo();
      getAllNotes();
      return () => {}
    }, [])

    // Delete Note
    const handleDelete = async (data) => {
        const noteId = data.id;
        try {
            const response = await axiosInstance.delete("/notes/delete-note/" + noteId);
            if(response.status === 200) {
                showToastMessage("Note Deleted Successfully", "delete");
                getAllNotes();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Search Note
    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/notes/search-note", {
                params: { query }
            });
            if(response.data && response.data.note) {
                setAllNotes(response.data.note);
                setIsSearch(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Clear Search
    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    // Update Pinned Note
    const updatePinnedNote = async (noteData) => {
        const noteId = noteData.id;
        console.log("Updating pinned note with ID:", noteId);

        try {
            const response = await axiosInstance.put("/notes/update-note-pinned/" + noteId, {
                isPinned: !noteData.isPinned,
            })

            if(response.data && response.data.note) {
                showToastMessage("Note Updated Successfully");
                getAllNotes();
            }
        } catch (error) {
            console.error(error);
        }
    }
    
  return (
    <>
        <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

        <div className='container mx-auto'>
            {allNotes.length > 0 ? (
                <div className='grid grid-cols-3 gap-4 mt-8'>
                    {allNotes.map((item) => {
                        return (
                            <NoteCard 
                                key={item.id}
                                title={item.title}
                                date={item.createdAt}
                                content={item.content}
                                tags={item.tags}
                                isPinned={item.isPinned}
                                onEdit={() => handleEditNote(item)}
                                onDelete={() => handleDelete(item)}
                                onPinNote={() => updatePinnedNote(item)}
                            />
                        );
                    })}
                </div>
            ) : (
                <EmptyCard 
                    imgSrc={isSearch ? noNoteImg : addNoteImg}
                    message={isSearch ? 
                        "Oops! There is no note matching the search."
                        : "Start creating your first note! Click on the 'Add' button to note down your thoughts, ideas and reminders. Let's get started!" 
                    }
                /> 
            )}
        </div>

        <button 
            className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
            onClick={() => {
                setOpenAddEditModal({ isShown: true, type:"add", data: null})
            }}
        >
            <MdAdd className='text-[32px] text-white'/>
        </button>

        <Modal
            appElement={document.getElementById('root')} 
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => {}}
            style={{
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.2)",
                },
            }}
            contentLabel=""
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
        >
            <AddEditNote 
                type={openAddEditModal.type}
                noteData={openAddEditModal.data}
                onClose={() => {
                    setOpenAddEditModal({ isShown: false, type: "add", data: null })
                }}
                getAllNotes={getAllNotes}
                showToastMessage={showToastMessage}
            />
        </Modal>

        <ToastMsg 
            isShown={showToastMsg.isShown}
            type={showToastMsg.type}
            message={showToastMsg.message}
            onClose={handleCloseToast}
        />

    </>
  )
}

export default Home
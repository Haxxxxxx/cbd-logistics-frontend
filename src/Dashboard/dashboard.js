import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

function ProjectsDashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user.uid]); // Dependency array to refetch projects if the user changes

  const fetchProjects = async () => {
    if (!user.uid) return;

    setLoading(true);
    const db = getFirestore();
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", user.uid));

    try {
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
    } catch (error) {
        console.error("Error fetching projects:", error);
    } finally {
        setLoading(false);
    }
};


  const addNewProject = async () => {
    const projectName = window.prompt("Enter the new project's name:");
    if (!projectName) return; // Exit if no name is entered

    const projectDescription = window.prompt("Enter the new project's description:");
    // Additional project details can be collected here

    setLoading(true);
    try {
      const db = getFirestore();
      await addDoc(collection(db, "projects"), {
        userId: user.uid,
        name: projectName,
        description: projectDescription,
        // Add more fields as needed
      });
      fetchProjects(); // Refetch projects to include the new one
    } catch (error) {
      console.error("Error creating new project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Projects</h1>
      <button onClick={addNewProject}>Create New Project</button>
      {loading ? <p>Loading projects...</p> : (
        <div>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id}>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                {/* Add more project details as needed */}
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectsDashboard;

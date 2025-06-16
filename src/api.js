const BASE_URL = "https://api.test.qualificamais.app.br";

async function request(endpoint, method = "GET", data = null) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Erro na requisição à API");
    }
    return response.json();
}

// Endpoints para /user
export const userAPI = {
    login: (email, password) =>
        request("/user/login", "POST", { email, password }),
    register: (userData) => request("/user/register", "POST", userData),
    updateUser: (userData) => request("/user/register", "PATCH", userData),
    getSubscribedCourses: (userId) =>
        request(`/user/${userId}/subscribed_courses/`, "GET"),
    subscribeCourse: (userId, courseId) =>
        request(`/user/${userId}/subscribed_courses/`, "POST", { courseId }),
    unsubscribeCourse: (userId, courseId) =>
        request(`/user/${userId}/subscribed_courses/`, "DELETE", { courseId }),
};

// Endpoints para /course
export const courseAPI = {
    getCourses: () => request("/course", "GET"),
    createCourse: (courseData) => request("/course", "POST", courseData),
    getCourseById: (courseId) => request(`/course/${courseId}`, "GET"),
    updateCourse: (courseId, courseData) =>
        request(`/course/${courseId}`, "PATCH", courseData),
    deleteCourse: (courseId) => request(`/course/${courseId}`, "DELETE"),
};

// Endpoints para /exam
export const examAPI = {
    getExamsBySection: (sectionId) => request(`/exam/${sectionId}`, "GET"),
    createExam: (sectionId, examData) =>
        request(`/exam/${sectionId}`, "POST", examData),
    getExamById: (sectionId, examId) =>
        request(`/exam/${sectionId}/${examId}`, "GET"),
    updateExam: (sectionId, examId, examData) =>
        request(`/exam/${sectionId}/${examId}`, "PATCH", examData),
    deleteExam: (sectionId, examId) =>
        request(`/exam/${sectionId}/${examId}`, "DELETE"),
    // Endpoints para answers
    getAnswers: (examId) => request(`/exam/answer/${examId}`, "GET"),
    submitAnswers: (answersArray) =>
        request(`/exam/answer`, "POST", answersArray),
};

// Endpoints para /lesson
export const lessonAPI = {
    getLessonsBySection: (sectionId) => request(`/lesson/${sectionId}`, "GET"),
    createLesson: (sectionId, lessonData) =>
        request(`/lesson/${sectionId}`, "POST", lessonData),
    updateLessonProgress: (progressData) =>
        request(`/lesson/progress`, "POST", progressData),
};

// Endpoints para /material
export const materialAPI = {
    getMaterialsBySection: (sectionId) =>
        request(`/material/${sectionId}`, "GET"),
    createMaterial: (sectionId, materialData) =>
        request(`/material/${sectionId}`, "POST", materialData),
};

// Endpoints para /comments
export const commentsAPI = {
    getCommentsByLesson: (lessonId) => request(`/comments/${lessonId}`, "GET"),
    postComment: (lessonId, commentData) =>
        request(`/comments/${lessonId}`, "POST", commentData),
    updateComment: (lessonId, commentId, commentData) =>
        request(`/comments/${lessonId}/${commentId}`, "PATCH", commentData),
    deleteComment: (lessonId, commentId) =>
        request(`/comments/${lessonId}/${commentId}`, "DELETE"),
};

export default {
    userAPI,
    courseAPI,
    examAPI,
    lessonAPI,
    materialAPI,
    commentsAPI,
};

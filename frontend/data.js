// CAMPUSAI STUDENT DATABASE

const students = {
    Sampada: {
        attendance: {
            AI: 23,
            PCP: 21,
            DLSS: 22,
            EM1: 20
        },
        totalClasses: {
            AI: 25,
            PCP: 24,
            DLSS: 25,
            EM1: 23
        },
        marks: {
            AI: 42,
            PCP: 38,
            DLSS: 44,
            EM1: 40
        }
    },

    Priya: {
        attendance: {
            AI: 21,
            PCP: 22,
            DLSS: 20,
            EM1: 19
        },
        totalClasses: {
            AI: 25,
            PCP: 24,
            DLSS: 25,
            EM1: 23
        },
        marks: {
            AI: 38,
            PCP: 43,
            DLSS: 36,
            EM1: 41
        }
    },

    Nithin: {
        attendance: {
            AI: 19,
            PCP: 20,
            DLSS: 22,
            EM1: 18
        },
        totalClasses: {
            AI: 25,
            PCP: 24,
            DLSS: 25,
            EM1: 23
        },
        marks: {
            AI: 35,
            PCP: 39,
            DLSS: 42,
            EM1: 34
        }
    },

    Sudeep: {
        attendance: {
            AI: 24,
            PCP: 21,
            DLSS: 23,
            EM1: 21
        },
        totalClasses: {
            AI: 25,
            PCP: 24,
            DLSS: 25,
            EM1: 23
        },
        marks: {
            AI: 45,
            PCP: 41,
            DLSS: 46,
            EM1: 43
        }
    }
};


// Get attendance percentage

function getAttendancePercentage(student, subject) {

    const attended = students[student].attendance[subject];
    const total = students[student].totalClasses[subject];

    return Math.round((attended / total) * 100);
}


// Get overall attendance

function getOverallAttendance(student) {

    let attended = 0;
    let total = 0;

    for (const subject of ["AI", "PCP", "DLSS", "EM1"]) {
        attended += students[student].attendance[subject];
        total += students[student].totalClasses[subject];
    }

    return Math.round((attended / total) * 100);
}


// Get average marks

function getAverageMarks(student) {

    const marks = students[student].marks;

    let total = 0;

    for (const subject of ["AI", "PCP", "DLSS", "EM1"]) {
        total += marks[subject];
    }

    return Math.round(total / 4);
}
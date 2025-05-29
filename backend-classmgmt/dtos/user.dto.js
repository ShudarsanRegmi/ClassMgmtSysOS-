// dtos/user.dto.js

function userProfileDto(user) {
  if (!user) return null;

  return {
    _id: user._id,
    uid: user.uid,
    name: user.name,
    email: user.email,
    phone: user.phone,
    rollNo: user.rollNo,
    photoUrl: user.photoUrl?.url || null,
    role: user.role,
    classId: user.classId,
    semester: user.semester,
    courses: user.courses,
  };
}

// New: For listing all users (lighter version)
function userListDto(user) {
  if (!user) return null;

  return {
    _id: user._id,
    uid: user.uid,
    name: user.name,
    email: user.email,
    phone: user.phone,
    rollNo: user.rollNo,
    role: user.role,
    classId: user.classId,
    photoUrl: user.photoUrl,
  };
}

module.exports = {
  userProfileDto,
  userListDto,
};

export const getUserId = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.id;
}

export const getUserFirstName = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.firstName;
}

export const getUserLastName = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.lastName;
}

export const getUserRole = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.role;
}

export const getGroups = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.groups;
}

export const getCurrentGroup = () => {
  return JSON.parse(localStorage.getItem('currentGroup'));
}

export const getOrganizationId = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.organizationId;
}

export const getOrganizationName = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.organization?.name
}

export const getProfileImage = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser?.image;
}

export const updateUser = (key, value) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser[ key ]) {
    currentUser[ key ] = value;
  }
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
}
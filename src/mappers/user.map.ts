export const toModel = (entity: Record<string, any>) => {
  const model = {
    _id: entity._id,
    fullname: entity.fullname,
    firstName: entity.firstName,
    lastName: entity.lastName,
    userName: entity.userName,
    email: entity.email,
    dob: entity.dob,
    gender: entity.gender,
    address: entity.address,
    phone_number: entity.phone_number,
    phone_code: entity.phone_code,
    roles: entity.roles,
    location: entity.location,
    is_deleted: entity.is_deleted,
    avatar: entity.avatar,
    created_at: entity.created_at,
    updated_at: entity.updated_at,
  };
  return model;
};

export const toAllModel = (entities: Record<string, any>[]) => {
  return entities.map((entity) => {
    return toModel(entity);
  });
};

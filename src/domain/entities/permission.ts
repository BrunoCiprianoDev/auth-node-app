export interface Permission {
    id: string;
    userId: string;
    roleId: string;
}

export interface PermissionWithoutId extends Omit<Permission, 'id'> {
}
package utils

/* Permissions */
const (
	CAN_ENCRYPT_DOCUMENTS    = 1 << 0
	HIGH_QUALITY_SCREENSHOTS = 1 << 1
	VANITY_URL               = 1 << 2
	MEMBER_PLUS_BADGE        = 1 << 3
	BETA_BADGE               = 1 << 4
	ADMIN_BADGE              = 1 << 5
	BAN_USERS                = 1 << 6
)

/* Roles */
const (
	DEFAULT     = CAN_ENCRYPT_DOCUMENTS
	BETA_TESTER = DEFAULT | VANITY_URL | BETA_BADGE
	MEMBER_PLUS = HIGH_QUALITY_SCREENSHOTS | VANITY_URL | MEMBER_PLUS_BADGE
	ADMIN       = MEMBER_PLUS | BAN_USERS | ADMIN_BADGE
)

func TestPermission(value int, flag int) bool {
	return (value & flag) == flag
}

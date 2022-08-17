package utils

/* Permissions */
const (
	canEncryptDocument      = 1 << 0
	highQualityScrreenshots = 1 << 1
	vanityURL               = 1 << 2
	banUsers                = 1 << 6
)

/* Roles */
const (
	member     = canEncryptDocument
	betaTester = member | vanityURL
	memberPlus = highQualityScrreenshots | vanityURL
	ADMIN      = memberPlus | banUsers
)

func TestPermission(value int, flag int) bool {
	return (value & flag) == flag
}

package utils

const (
	MEMBER_PLUS = 1 << 0
	ADMIN       = 1 << 1
)

func TestPermission(value uint, flag uint) bool {
	return (value & flag) == flag
}

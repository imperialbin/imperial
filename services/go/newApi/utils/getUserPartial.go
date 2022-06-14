package utils

import "newapi/models"

func GetUserPartial(username string) (*models.UserPartial, error) {
	client := GetDB()

	var user models.User
	if result := client.First(&user, "username = ? ", username); result.Error != nil {
		return nil, result.Error
	}

	return &models.UserPartial{
		UserID:        user.ID,
		Username:      user.Username,
		DocumentsMade: user.DocumentsMade,
		Icon:          user.Icon,
		Flags:         user.Flags,
	}, nil
}

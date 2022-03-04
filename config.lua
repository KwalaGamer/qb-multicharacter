Config = {}
Config.StartingApartment = true -- Enable/disable starting apartments (make sure to set default spawn coords)
Config.Interior = vector3(545.18, -2787.26, 6.1) -- Interior to load where characters are previewed
Config.DefaultSpawn = vector3(-1044.93, -2750.41, 21.36) -- Default spawn coords if you have start apartments disabled
Config.PedCoords = vector4(545.87, -2787.69, 6.1, 334.44) -- Create preview ped at these coordinates
Config.HiddenCoords = vector4(-812.23, 182.54, 76.74, 156.5) -- Hides your actual ped while you are in selection
Config.CamCoords = vector4(546.11, -2785.28, 6.1, 148.89) -- Camera coordinates for character preview screen

--Config.DefaultNumberOfCharacters = 5 --iT Will Not Work...
Config.PlayersNumberOfCharacters = { -- Define maximum amount of player characters by rockstar license (you can find this license in your server's database in the player table)
    { license = "license:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", numberOfChars = 2 },
}

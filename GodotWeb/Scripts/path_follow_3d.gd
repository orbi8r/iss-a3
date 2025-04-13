extends PathFollow3D

@onready var path_follow_3d: PathFollow3D = $"."


func _input(event: InputEvent) -> void:
	if event is InputEventMouse:
		if Input.is_action_just_pressed("ScrollDown"):
			path_follow_3d.progress_ratio += 0.005
		if Input.is_action_just_pressed("ScrollUp"):
			path_follow_3d.progress_ratio -= 0.005

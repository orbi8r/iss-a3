extends Node3D

@onready var path_follow_3d: PathFollow3D = $Path3D/PathFollow3D

# Variables
var scroll_speed = 0.5
var scroll = 0.0

func _input(event: InputEvent) -> void:
	if event is InputEventMouse:
		if Input.is_action_just_pressed("ScrollDown"):
			if scroll < 0:
				scroll = scroll_speed
			scroll += scroll_speed
		if Input.is_action_just_pressed("ScrollUp"):
			if scroll > 0:
				scroll = -scroll_speed
			scroll -= scroll_speed


func _process(delta: float) -> void:
	path_follow_3d.progress += scroll * delta;
	scroll -= scroll * delta;

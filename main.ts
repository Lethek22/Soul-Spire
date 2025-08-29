namespace SpriteKind {
    export const Camman = SpriteKind.create()
    export const Curso = SpriteKind.create()
    export const Decor = SpriteKind.create()
    export const Door = SpriteKind.create()
    export const Deth = SpriteKind.create()
    export const Drop = SpriteKind.create()
    export const DethProj = SpriteKind.create()
    export const BossEnemy = SpriteKind.create()
    export const Runging = SpriteKind.create()
    export const $$$ = SpriteKind.create()
    export const Un$$$ = SpriteKind.create()
    export const SwingDoor = SpriteKind.create()
    export const FollowDecorX = SpriteKind.create()
    export const Shopper = SpriteKind.create()
    export const Sale = SpriteKind.create()
    export const Plate = SpriteKind.create()
    export const Barr = SpriteKind.create()
    export const Press = SpriteKind.create()
    export const PressStation = SpriteKind.create()
}
/**
 * WeaponInvis?
 * 
 * Melee?
 * 
 * AtkImage
 * 
 * AtkFatal?
 * 
 * Damage
 * 
 * Knockback
 * 
 * Lifespan
 * 
 * Reload
 * 
 * AttackGhost?
 * 
 * AtkX-Int
 * 
 * AtkY-Int
 * 
 * MausX
 * 
 * MausY
 * 
 * Anims_1-6
 */
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick41`, function (sprite, location) {
    if (mySprite.vy > -80 && controller.up.isPressed()) {
        mySprite.vy += -15
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (ListEffects[12] == 20) {
        if (!(sprites.readDataBoolean(mySprite, "CanMove?") || sprites.readDataBoolean(mySprite, "CanDash?"))) {
            ListEffects[12] = 19
            timer.after(400, function () {
                ListEffects[12] = 20
            })
            otherSprite.startEffect(effects.ashes, 200)
            sprites.changeDataNumberBy(otherSprite, "HP", (19 + ListEffects[6]) * ListEffects[7] * -1)
            if (sprites.readDataNumber(otherSprite, "HP") <= 0) {
                EnemyDeath(otherSprite)
                sprites.changeDataNumberBy(mySprite, "HP", -1 + ListEffects[8])
            }
        }
    }
    if (ListEffects[12] != 19) {
        Hit(otherSprite)
    }
})
function TileShift (TileMaps: tiles.TileMapData[]) {
    tiles.setCurrentTilemap(TileMaps[ListStorage[10] - 2])
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.$$$, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    ListStorage[12] = ListStorage[12] + 1
    MoneyText.setText(convertToText(ListStorage[12]))
    MoneyText.setFlag(SpriteFlag.Invisible, false)
    MoneyText.fx = 5
    while (MoneyText.fx != 0) {
        MoneyText.fx += -1
        pause(500)
    }
    MoneyText.setFlag(SpriteFlag.Invisible, true)
    MoneyText.fx = 0
})
function ProjHit (sprite: Sprite, otherSprite: Sprite) {
    if (sprites.readDataBoolean(sprite, "Fatal?") && (sprites.readDataNumber(otherSprite, "HP") != 10001 && !(sprites.readDataBoolean(otherSprite, "Melee?")))) {
        if (sprites.readDataBoolean(mySprite, "Melee?")) {
            sprites.setDataBoolean(sprite, "Fatal?", false)
            if (sprites.readDataNumber(mySprite, "Weapon") == 14) {
                sprites.setDataBoolean(sprite, "Fatal?", true)
                sprites.setDataBoolean(otherSprite, "Melee?", true)
            }
        } else {
            sprites.destroy(sprite)
        }
        if (otherSprite.kind() == SpriteKind.Enemy) {
            if (sprite.x - otherSprite.x < 0) {
                otherSprite.setVelocity(sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / 50), sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / -100))
            } else {
                otherSprite.setVelocity(sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / -50), sprites.readDataNumber(sprite, "Knockback") / (sprites.readDataNumber(otherSprite, "KBResistence") / -100))
            }
        } else if (otherSprite.kind() == SpriteKind.BossEnemy) {
            if (Boss.fy == 0 && ListStorage[2] == ListStorage[16]) {
                Boss.fy = 1
                animation.runImageAnimation(
                Boss,
                assets.animation`Happy1`,
                100,
                false
                )
                timer.after(1500, function () {
                    Boss.ay = 500
                    Decoration.ay = -200
                    Decoration.lifespan = 5000
                    timer.after(250, function () {
                        scene.cameraShake(2, 300)
                    })
                })
                timer.after(2200, function () {
                    sprites.setDataBoolean(Boss, "Fatal?", true)
                    sprites.setDataNumber(Boss, "HP", 1500)
                    sprites.setDataNumber(Boss, "FacingLeft?", 1)
                    PlateTitle(assets.image`PlateB2`)
                    _2BossAttack(1)
                })
            }
        }
        otherSprite.startEffect(effects.ashes, 200)
        sprites.setDataBoolean(otherSprite, "Alert?", true)
        sprites.changeDataNumberBy(otherSprite, "HP", (sprites.readDataNumber(sprite, "Damage") - 1 + ListEffects[6]) * ListEffects[7] * -1)
        ListStorage[7] = ListStorage[7] + 1
        if (sprites.readDataNumber(otherSprite, "HP") <= 0) {
            EnemyDeath(otherSprite)
            sprites.changeDataNumberBy(mySprite, "HP", -1 + ListEffects[8])
        }
    }
}
function _2BossAttack (Atk2: number) {
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (sprites.readDataNumber(Boss, "FacingLeft?") == 1 && mySprite.x - Boss.x > 0) {
            sprites.setDataNumber(Boss, "FacingLeft?", 0)
            animation.runImageAnimation(
            Boss,
            assets.animation`Happy3`,
            100,
            false
            )
            pause(500)
        } else if (sprites.readDataNumber(Boss, "FacingLeft?") == 0 && mySprite.x - Boss.x < 0) {
            sprites.setDataNumber(Boss, "FacingLeft?", 1)
            animation.runImageAnimation(
            Boss,
            assets.animation`Happy2`,
            100,
            false
            )
            pause(500)
        }
        if (Atk2 == 1) {
            DirectionalAnim(assets.animation`Happy4`, assets.animation`Happy5`, 100, false)
            timer.after(800, function () {
                sprites.setDataNumber(Boss, "Rarity", 998)
                timer.after(500, function () {
                    sprites.setDataNumber(Boss, "Rarity", 997)
                })
            })
            timer.after(950, function () {
                scene.cameraShake(3, 200)
                for (let index = 0; index < randint(3, 5); index++) {
                    BossProjectile(9, true, false, 10000, assets.animation`Happy6`, image.create(15, 15), true)
                    EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                    EnemProj.setPosition(scene.cameraProperty(CameraProperty.X) + randint(-60, 60), scene.cameraProperty(CameraProperty.Y) - 68)
                    EnemProj.ay = 150
                    pause(randint(100, 500))
                }
            })
            timer.after(1500, function () {
                if (sprites.readDataNumber(Boss, "HP") > 900) {
                    _2BossAttack(randint(1, 3))
                } else {
                    _2BossAttack(randint(1, 5))
                }
            })
        } else if (Atk2 == 2) {
            DirectionalAnim(assets.animation`Happy8`, assets.animation`Happy9`, 100, false)
            timer.after(750, function () {
                for (let index = 0; index <= 1; index++) {
                    BossProjectile(25, true, true, 10000, assets.animation`Happy7`, image.create(15, 15), false)
                    EnemProj.setPosition(Boss.x + (sprites.readDataNumber(Boss, "FacingLeft?") * 2 - 1) * 9, Boss.y - 15)
                    EnemProj.vy = -50
                    EnemProj.ay = -500
                    SpecifiedProj(EnemProj, 1000, 2)
                    if (sprites.readDataNumber(Boss, "HP") > 300) {
                        break;
                    }
                }
            })
            timer.after(2000, function () {
                if (sprites.readDataNumber(Boss, "HP") > 900) {
                    _2BossAttack(randint(1, 3))
                } else {
                    _2BossAttack(randint(1, 5))
                }
            })
        } else if (Atk2 == 3) {
            if (sprites.readDataNumber(Boss, "HP") > 300) {
                Decoration = sprites.create(assets.image`Wires`, SpriteKind.Decor)
                Decoration.setFlag(SpriteFlag.Ghost, true)
                tiles.placeOnTile(Decoration, tiles.getTileLocation(Boss.tilemapLocation().column, Boss.tilemapLocation().row - 12))
                Decoration.vy = 230
                Decoration.ay = -200
                timer.after(1000, function () {
                    Decoration.vy = 0
                    Decoration.ay = 0
                    timer.after(500, function () {
                        Decoration.ay = -100
                        Boss.ay = -100
                        Boss.setFlag(SpriteFlag.GhostThroughWalls, true)
                        timer.after(1500, function () {
                            if (Math.percentChance(20)) {
                                Simplified(2, 7, 4)
                            } else {
                                if (Math.percentChance(50)) {
                                    if (Math.percentChance(50)) {
                                        Simplified(2, 10, 5)
                                    } else {
                                        Simplified(2, 15, 6)
                                    }
                                } else {
                                    if (Math.percentChance(50)) {
                                        Simplified(2, 20, 5)
                                    } else {
                                        Simplified(2, 23, 4)
                                    }
                                }
                            }
                        })
                    })
                })
                DirectionalAnim(assets.animation`Happy11`, assets.animation`Happy12`, 100, false)
                timer.after(5000, function () {
                    if (sprites.readDataNumber(Boss, "HP") > 900) {
                        _2BossAttack(randint(1, 2))
                    } else {
                        if (Math.percentChance(50)) {
                            _2BossAttack(randint(1, 2))
                        } else {
                            _2BossAttack(randint(4, 5))
                        }
                    }
                })
            } else {
                if (Math.percentChance(50)) {
                    _2BossAttack(randint(1, 2))
                } else {
                    _2BossAttack(randint(4, 5))
                }
            }
        } else if (Atk2 == 4) {
            DirectionalAnim(assets.animation`Happy15`, assets.animation`Happy16`, 100, false)
            timer.after(900, function () {
                for (let index = 0; index <= 6; index++) {
                    BossProjectile(12, false, true, 1400, assets.animation`Happy14`, image.create(16, 18), false)
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(mySprite.tilemapLocation().column + randint(-3, 3), 0))
                    if (EnemProj.tilemapLocation().column <= 8 || EnemProj.tilemapLocation().column >= 22) {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 13))
                    } else if (EnemProj.tilemapLocation().column <= 11 || EnemProj.tilemapLocation().column >= 19) {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 14))
                    } else {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 15))
                    }
                    SpecifiedProj(EnemProj, 500, 3)
                    if (sprites.readDataNumber(Boss, "HP") > 300 && index == 2) {
                        break;
                    }
                }
            })
            timer.after(1600, function () {
                _2BossAttack(randint(1, 5))
            })
        } else if (Atk2 == 5) {
            DirectionalAnim(assets.animation`Happy19`, assets.animation`Happy20`, 100, false)
            timer.after(700, function () {
                BossProjectile(16, true, false, 800, assets.animation`Happy17`, image.create(15, 15), false)
                EnemProj.setPosition(Boss.x + 9, Boss.y - 18)
                EnemProj.vy = -75
                EnemProj.ay = 100
                SpecifiedProj(EnemProj, 700, 4)
                if (sprites.readDataNumber(Boss, "HP") <= 300) {
                    SpecifiedProj(EnemProj, 900, 4)
                }
            })
            timer.after(1800, function () {
                _2BossAttack(randint(1, 5))
            })
        }
    }
}
function Atk (WInvis: boolean, Melee: boolean, AImage: Image, AFatal: boolean, Dmg: number, KB: number, LifeSp: number, Reload: number, AGhost: boolean, AXInt: number, AYInt: number, MouseX: number, MouseY: number, Anim1: any[], Anim2: any[], Anim3: any[], Anim4: any[], Anim5: any[], Anim6: any[], ManaCost: number, Loop: boolean) {
    if (sprites.readDataNumber(mySprite, "Mana") >= ManaCost) {
        sprites.changeDataNumberBy(mySprite, "Mana", ManaCost * -1)
        Weapon.setFlag(SpriteFlag.Invisible, WInvis)
        sprites.setDataBoolean(mySprite, "Melee?", Melee)
        sprites.setDataBoolean(mySprite, "Reloaded?", false)
        Attack = sprites.create(AImage, SpriteKind.Projectile)
        Attack.z = 3
        sprites.setDataBoolean(Attack, "Fatal?", AFatal)
        sprites.setDataNumber(Attack, "Damage", Dmg)
        sprites.setDataNumber(Attack, "Knockback", KB)
        Attack.lifespan = LifeSp
        Attack.setFlag(SpriteFlag.GhostThroughWalls, AGhost)
        Attack.setPosition(mySprite.x + AXInt, mySprite.y + AYInt)
        DuraText.setFlag(SpriteFlag.Invisible, false)
        if (ManaCost != 0) {
            ListStorage[19] = 0
        }
        if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponASlot")) {
            sprites.changeDataNumberBy(Weapon, "WeaponADura", -1)
            DuraText.setText("" + sprites.readDataNumber(Weapon, "WeaponADura") + "/" + ListDurability[sprites.readDataNumber(mySprite, "Weapon")])
            if (sprites.readDataNumber(Weapon, "WeaponADura") <= 0) {
                sprites.setDataNumber(mySprite, "WeaponASlot", ListStorage[21])
                sprites.setDataNumber(mySprite, "Weapon", ListStorage[21])
            }
            if (sprites.readDataNumber(mySprite, "WeaponASlot") <= 3) {
                sprites.changeDataNumberBy(Weapon, "WeaponADura", 1)
                DuraText.setText("--/--")
            }
        } else if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponBSlot")) {
            sprites.changeDataNumberBy(Weapon, "WeaponBDura", -1)
            DuraText.setText("" + sprites.readDataNumber(Weapon, "WeaponBDura") + "/" + ListDurability[sprites.readDataNumber(mySprite, "Weapon")])
            if (sprites.readDataNumber(Weapon, "WeaponBDura") <= 0) {
                sprites.setDataNumber(mySprite, "WeaponBSlot", ListStorage[22])
                sprites.setDataNumber(mySprite, "Weapon", ListStorage[22])
            }
            if (sprites.readDataNumber(mySprite, "WeaponBSlot") <= 3) {
                sprites.changeDataNumberBy(Weapon, "WeaponBDura", 1)
                DuraText.setText("--/--")
            }
        }
        if (mySprite.x - (scene.cameraProperty(CameraProperty.Left) + MouseX) <= 0) {
            animation.runImageAnimation(
            Attack,
            Anim1,
            100,
            Loop
            )
            animation.runImageAnimation(
            Weapon,
            Anim2,
            100,
            false
            )
            animation.runImageAnimation(
            mySprite,
            Anim3,
            100,
            false
            )
        } else {
            animation.runImageAnimation(
            Attack,
            Anim4,
            100,
            Loop
            )
            animation.runImageAnimation(
            Weapon,
            Anim5,
            100,
            false
            )
            animation.runImageAnimation(
            mySprite,
            Anim6,
            100,
            false
            )
        }
        timer.after(LifeSp - 50, function () {
            Weapon.setFlag(SpriteFlag.Invisible, false)
        })
        timer.after(Reload, function () {
            Weapon.setFlag(SpriteFlag.Invisible, false)
            sprites.setDataBoolean(mySprite, "Melee?", false)
            sprites.setDataBoolean(mySprite, "Reloaded?", true)
            sprites.setDataString(mySprite, "State", "Idle")
        })
    }
}
sprites.onDestroyed(SpriteKind.DethProj, function (sprite) {
    if (ListMod[ListStorage[1] - 2] == -1) {
        if (ListStorage[2] == ListStorage[16]) {
            if (sprites.readDataNumber(sprite, "Damage") == 25) {
                BossProjectile(24, true, true, 400, assets.animation`Happy10`, image.create(48, 80), false)
                tiles.placeOnTile(EnemProj, sprite.tilemapLocation())
            }
        } else if (ListStorage[2] == 4) {
            if (sprites.readDataNumber(sprite, "Damage") == 11) {
                BossProjectile(9, true, true, 3000, assets.animation`Fire`, image.create(8, 16), true)
                tiles.placeOnTile(EnemProj, sprite.tilemapLocation())
                EnemProj.x = sprite.x
            }
        } else {
        	
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick65`, function (sprite, location) {
    sprites.changeDataNumberBy(mySprite, "HP", -0.25)
    if (sprites.readDataNumber(mySprite, "HP") <= 0) {
        sprites.setDataNumber(mySprite, "HP", 100)
        Death("Drown")
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile13`, function (sprite, location) {
    for (let value of tiles.getTilesByType(assets.tile`myTile13`)) {
        tiles.setTileAt(value, assets.tile`transparency16`)
        timer.after(500, function () {
            tiles.setTileAt(value, assets.tile`myTile13`)
        })
    }
    sprites.changeDataNumberBy(mySprite, "HP", -25)
    if (sprites.readDataNumber(mySprite, "HP") <= 0) {
        sprites.setDataNumber(mySprite, "HP", 0)
        Death("Fall")
    } else {
        mySprite.vy = 0
        tiles.placeOnTile(mySprite, tiles.getTileLocation(ListStorage[13], ListStorage[14]))
        if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(mySprite.tilemapLocation().column, mySprite.tilemapLocation().row + 1)) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick5`))))) {
            tiles.placeOnTile(mySprite, tiles.getTileLocation(mySprite.tilemapLocation().column + 1, mySprite.tilemapLocation().row))
            if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(mySprite.tilemapLocation().column, mySprite.tilemapLocation().row + 1)) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick5`))))) {
                tiles.placeOnTile(mySprite, tiles.getTileLocation(mySprite.tilemapLocation().column - 2, mySprite.tilemapLocation().row))
            }
        }
    }
})
function Enemies (HP: number, KnockBackRes: number, Ident: number, Damage: number, Sprite2: Sprite, Money: number, Anim: any[], InitialImg: Image) {
    Enemy1 = sprites.create(InitialImg, SpriteKind.Enemy)
    sprites.setDataNumber(Enemy1, "HP", HP * (ListStorage[18] / 2 + 0.5))
    sprites.setDataNumber(Enemy1, "KBResistence", KnockBackRes)
    sprites.setDataNumber(Enemy1, "Ident", Ident)
    sprites.setDataNumber(Enemy1, "Damage", Damage)
    sprites.setDataNumber(Enemy1, "Attacking", 0)
    sprites.setDataBoolean(Enemy1, "Fatal?", false)
    sprites.setDataBoolean(Enemy1, "Invincible?", true)
    Enemy1.z = 1
    sprites.setDataBoolean(Enemy1, "Mark", sprites.readDataBoolean(mySprite, "Mark"))
    sprites.setDataNumber(Enemy1, "Money", Money)
    animation.runImageAnimation(
    Enemy1,
    Anim,
    100,
    false
    )
    if (sprites.readDataBoolean(Enemy1, "Mark")) {
        ListStorage[8] = ListStorage[8] + 1
    }
}
function IdentAnim (sprite: Sprite, Ident: number, Anim: any[], Framerate: number, Loop: boolean) {
    if (sprites.readDataNumber(sprite, "Ident") == Ident) {
        animation.runImageAnimation(
        sprite,
        Anim,
        Framerate,
        Loop
        )
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.BossEnemy, function (sprite, otherSprite) {
    Hit(otherSprite)
})
function BossSpawning (Hp: number, Damage: number, KBRes: number, Money: number, Anim: any[], Location: tiles.Location) {
    sprites.setDataBoolean(Boss, "Fatal?", false)
    sprites.setDataBoolean(Boss, "Mark", true)
    sprites.setDataNumber(Boss, "HP", Hp * (ListStorage[18] / 2 + 0.5))
    sprites.setDataNumber(Boss, "Damage", Damage)
    sprites.setDataNumber(Boss, "KBResistence", KBRes)
    sprites.setDataNumber(Boss, "Money", Money)
    tiles.placeOnTile(Boss, Location)
    animation.runImageAnimation(
    Boss,
    Anim,
    100,
    false
    )
}
function _4BossAttack (Atk2: number) {
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (sprites.readDataNumber(Boss, "FacingLeft?") == 1 && mySprite.x - Boss.x > 0) {
            sprites.setDataNumber(Boss, "FacingLeft?", 0)
        } else if (sprites.readDataNumber(Boss, "FacingLeft?") == 0 && mySprite.x - Boss.x < 0) {
            sprites.setDataNumber(Boss, "FacingLeft?", 1)
        }
        if (Atk2 == 1) {
            if (Boss.tilemapLocation().column <= 50 || Math.percentChance(50) && Boss.tilemapLocation().column < 56) {
                animation.runImageAnimation(
                Boss,
                assets.animation`Boss4AR`,
                100,
                false
                )
                timer.after(600, function () {
                    Boss.vx = randint(64, 156)
                })
            } else {
                animation.runImageAnimation(
                Boss,
                assets.animation`Boss4AL`,
                100,
                false
                )
                timer.after(600, function () {
                    Boss.vx = randint(-64, -156)
                })
            }
            Boss.fx = 100
            timer.after(2100, function () {
                pauseUntil(() => Boss.vx == 0)
                Boss.fx = 0
                if (sprites.readDataNumber(Boss, "HP") > 750) {
                    _4BossAttack(randint(2, 5))
                } else {
                    _4BossAttack(randint(2, 6))
                }
            })
        } else if (Atk2 == 2) {
            DirectionalAnim(assets.animation`Boss4BL`, assets.animation`Boss4BR`, 100, false)
            timer.after(600, function () {
                BossProjectile(15, true, true, 1300, assets.animation`Boss4BoltA`, image.create(16, 16), true)
                EnemProj.setPosition(Boss.x, Boss.y)
                ProjTrackII(EnemProj, mySprite.x, mySprite.y, 200)
                EnemProj.ax = (mySprite.x - EnemProj.x) / Math.sqrt((mySprite.x - EnemProj.x) ** 2 + (mySprite.y - EnemProj.y) ** 2) * -300
                EnemProj.ay = (mySprite.y - EnemProj.y) / Math.sqrt((mySprite.x - EnemProj.x) ** 2 + (mySprite.y - EnemProj.y) ** 2) * -300
                SpecifiedProj(EnemProj, 400, 6)
                timer.after(1800, function () {
                    if (sprites.readDataNumber(Boss, "HP") > 750) {
                        _4BossAttack(randint(1, 5))
                    } else {
                        _4BossAttack(randint(1, 6))
                    }
                })
            })
        } else if (Atk2 == 3) {
            DirectionalAnim(assets.animation`Boss4CL`, assets.animation`Boss4CR`, 100, false)
            timer.after(500, function () {
                BossProjectile(10, true, true, 900, assets.animation`Boss4Bolt3R`, image.create(16, 18), false)
                EnemProj.setPosition(Boss.x + (sprites.readDataNumber(Boss, "FacingLeft?") * -2 + 1) * 7, Boss.y)
                EnemProj.vx = 150
                EnemProj.fx = 175
                BossProjectile(10, true, true, 900, assets.animation`Boss4Bolt3L`, image.create(16, 18), false)
                EnemProj.setPosition(Boss.x + (sprites.readDataNumber(Boss, "FacingLeft?") * -2 + 1) * 7, Boss.y)
                EnemProj.vx = -150
                EnemProj.fx = 175
                timer.after(700, function () {
                    if (sprites.readDataNumber(Boss, "HP") > 750) {
                        _4BossAttack(randint(1, 5))
                    } else {
                        _4BossAttack(randint(1, 6))
                    }
                })
            })
        } else if (Atk2 == 4) {
            if (Math.abs(mySprite.x - Boss.x) <= 32) {
                DirectionalAnim(assets.animation`Boss4DL`, assets.animation`Boss4DR`, 100, false)
                timer.after(100, function () {
                    Boss.vx = (sprites.readDataNumber(Boss, "FacingLeft?") * -2 + 1) * 60
                    sprites.setDataNumber(Boss, "Damage", 20)
                    timer.after(400, function () {
                        Boss.vx = 0
                        sprites.setDataNumber(Boss, "Damage", 14)
                    })
                })
                timer.after(600, function () {
                    if (sprites.readDataNumber(Boss, "HP") > 750) {
                        _4BossAttack(randint(1, 5))
                    } else {
                        _4BossAttack(randint(1, 6))
                    }
                })
            } else {
                if (sprites.readDataNumber(Boss, "HP") > 750) {
                    _4BossAttack(randint(1, 5))
                } else {
                    _4BossAttack(randint(1, 6))
                }
            }
        } else if (Atk2 == 5) {
            DirectionalAnim(assets.animation`Boss4EL`, assets.animation`Boss4ER`, 100, false)
            timer.after(400, function () {
                for (let index = 0; index < 3; index++) {
                    BossProjectile(11, true, false, 10000, assets.animation`Boss4Bolt2`, image.create(8, 8), true)
                    EnemProj.setPosition(Boss.x - (sprites.readDataNumber(Boss, "FacingLeft?") * -2 + 1) * -9, Boss.y - 3)
                    EnemProj.setVelocity(mySprite.x - Boss.x + randint(-30, 30), randint(-175, -250))
                    EnemProj.ay = 400
                    EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                }
                timer.after(1200, function () {
                    if (sprites.readDataNumber(Boss, "HP") > 750) {
                        _4BossAttack(randint(1, 5))
                    } else {
                        _4BossAttack(randint(1, 6))
                    }
                })
            })
        } else if (Atk2 == 6) {
            DirectionalAnim(assets.animation`Boss4FL`, assets.animation`Boss4FR`, 100, false)
            timer.after(500, function () {
                BossProjectile(15, true, true, 1000, assets.animation`Boss4BoltD`, image.create(16, 16), true)
                EnemProj.setPosition(Boss.x, Boss.y)
                ProjTrackII(EnemProj, mySprite.x, mySprite.y, 200)
                EnemProj.ax = (mySprite.x - EnemProj.x) / Math.sqrt((mySprite.x - EnemProj.x) ** 2 + (mySprite.y - EnemProj.y) ** 2) * -300
                EnemProj.ay = (mySprite.y - EnemProj.y) / Math.sqrt((mySprite.x - EnemProj.x) ** 2 + (mySprite.y - EnemProj.y) ** 2) * -300
                SpecifiedProj(EnemProj, 650, 7)
                timer.after(1500, function () {
                    _4BossAttack(randint(1, 6))
                })
            })
        }
    }
}
function Simplified (Ident: number, IntPara: number, IntParaB: number) {
    if (Ident == 1) {
        Boss.vx = 8 * IntPara
        timer.after(500, function () {
            Boss.vx = 12 * IntPara
            timer.after(1000, function () {
                Boss.vx = 32 * IntPara
                timer.after(1500, function () {
                    Boss.vx = 12 * IntPara
                    timer.after(1000, function () {
                        Boss.vx = 8 * IntPara
                        timer.after(500, function () {
                            Boss.vx = 0
                        })
                    })
                })
            })
        })
    } else if (Ident == 2) {
        tiles.placeOnTile(Boss, tiles.getTileLocation(IntPara, IntParaB))
        tiles.placeOnTile(Decoration, tiles.getTileLocation(IntPara, IntParaB - 4))
        Decoration.vy = 230
        Decoration.ay = -200
        Boss.vy = 230
        Boss.ay = -200
        timer.after(1000, function () {
            Boss.ay = 500
            Boss.setFlag(SpriteFlag.GhostThroughWalls, false)
            Decoration.lifespan = 5000
            timer.after(200, function () {
                scene.cameraShake(2, 200)
            })
        })
    } else if (Ident == 3) {
        scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`Inventory1`)
        ListStorage[20] = 1
        ListStorage[10] = 1
        MoneyText.setPosition(70, 30)
        MoneyText.left = 70
        MoneyText.setFlag(SpriteFlag.Invisible, false)
        for (let index = 0; index <= 1; index++) {
            Button = sprites.create(assets.image`MenuButton`, SpriteKind.Press)
            Button.setFlag(SpriteFlag.GhostThroughWalls, true)
            Button.z = 994
            if (index == 0) {
                sprites.setDataNumber(Button, "Ident", sprites.readDataNumber(mySprite, "WeaponASlot"))
            } else {
                sprites.setDataNumber(Button, "Ident", sprites.readDataNumber(mySprite, "WeaponBSlot"))
            }
            Button.image.drawTransparentImage(ListWeapons[sprites.readDataNumber(Button, "Ident") - 1], 2, 2)
            sprites.setDataNumber(Button, "KBResistence", ListStorage[10])
            ListStorage[10] = ListStorage[10] + 1
            sprites.setDataNumber(Button, "HP", 2)
            SpecifiedProj(Button, 1, 15)
        }
        ListStorage[10] = 5
        for (let index = 0; index <= 15; index++) {
            if (ListEffects[index] != 1) {
                Button = sprites.create(assets.image`MenuButton`, SpriteKind.Press)
                Button.setFlag(SpriteFlag.GhostThroughWalls, true)
                Button.z = 994
                sprites.setDataNumber(Button, "Ident", index + 1)
                Button.image.drawTransparentImage(ListItems[index], 2, 2)
                sprites.setDataNumber(Button, "KBResistence", ListStorage[10])
                ListStorage[10] = ListStorage[10] + 1
                sprites.setDataNumber(Button, "HP", 3)
                SpecifiedProj(Button, 1, 15)
            }
        }
        Menuer(0, ListWeapons)
    } else if (Ident == 4) {
        ListStorage[20] = 0
        MoneyText.setPosition(2, 8)
        MoneyText.left = 2
        MoneyText.setFlag(SpriteFlag.Invisible, true)
        sprites.setDataNumber(CameraSpr, "Ident", 0)
        NamePlate.setFlag(SpriteFlag.Invisible, true)
        Cursor.setFlag(SpriteFlag.Invisible, true)
        DuraText.setFlag(SpriteFlag.Invisible, false)
        sprites.destroyAllSpritesOfKind(SpriteKind.Press)
        sprites.destroyAllSpritesOfKind(SpriteKind.PressStation)
        scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`Light`)
    } else {
    	
    }
}
function ProjTrackII (Projectile: Sprite, TargetX: number, TargetY: number, Speed: number) {
    Projectile.setVelocity((TargetX - Projectile.x) / Math.sqrt((TargetX - Projectile.x) ** 2 + (TargetY - Projectile.y) ** 2) * Speed, (TargetY - Projectile.y) / Math.sqrt((TargetX - Projectile.x) ** 2 + (TargetY - Projectile.y) ** 2) * Speed)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Drop, function (sprite, otherSprite) {
    if (browserEvents.Q.isPressed()) {
        if (sprites.readDataNumber(otherSprite, "Type") == 1) {
            if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponASlot")) {
                sprites.setDataNumber(mySprite, "WeaponASlot", sprites.readDataNumber(otherSprite, "Ident"))
                sprites.setDataNumber(Weapon, "WeaponADura", ListDurability[sprites.readDataNumber(otherSprite, "Ident")])
                DuraText.setText("" + sprites.readDataNumber(Weapon, "WeaponADura") + "/" + ListDurability[sprites.readDataNumber(otherSprite, "Ident")])
            } else if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponBSlot")) {
                sprites.setDataNumber(mySprite, "WeaponBSlot", sprites.readDataNumber(otherSprite, "Ident"))
                sprites.setDataNumber(Weapon, "WeaponBDura", ListDurability[sprites.readDataNumber(otherSprite, "Ident")])
                DuraText.setText("" + sprites.readDataNumber(Weapon, "WeaponBDura") + "/" + ListDurability[sprites.readDataNumber(otherSprite, "Ident")])
            }
            PlateTitle(ListNamePlates[0][sprites.readDataNumber(otherSprite, "Ident") - 1])
            sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(otherSprite, "Ident"))
            WeaponHoldImgs(ListWeapons, "Weapon", Weapon, mySprite)
            sprites.destroy(otherSprite)
        } else if (sprites.readDataNumber(otherSprite, "Type") == 2) {
            for (let index = 0; index <= 15; index++) {
                ItemEffects(otherSprite, index + 1, [
                2,
                0.5,
                0.5,
                0.5,
                0.5,
                1.25,
                6,
                1.5,
                4,
                1.25,
                0,
                0.8,
                20,
                0,
                0,
                0
                ][index])
            }
            animation.runImageAnimation(
            otherSprite,
            assets.animation`ItemPickup`,
            100,
            false
            )
            timer.after(300, function () {
                sprites.destroy(otherSprite)
            })
        } else {
        	
        }
        pauseUntil(() => !(browserEvents.Q.isPressed()))
    }
})
function PlateTitle (IdentImg: Image) {
    if (sprites.readDataNumber(CameraSpr, "Ident") == 4) {
        NamePlate.y += 12
        timer.after(2200, function () {
            NamePlate.y += -12
        })
    }
    NamePlate.setImage(IdentImg)
    NamePlate.setFlag(SpriteFlag.Invisible, false)
    NamePlate.image.replace(1, 13)
    NamePlate.image.replace(12, 14)
    timer.after(100, function () {
        NamePlate.image.replace(13, 1)
        NamePlate.image.replace(14, 12)
        timer.after(2000, function () {
            NamePlate.image.replace(1, 13)
            NamePlate.image.replace(12, 14)
            timer.after(100, function () {
                NamePlate.setFlag(SpriteFlag.Invisible, true)
                NamePlate.image.replace(13, 1)
                NamePlate.image.replace(14, 12)
            })
        })
    })
}
function SpecifiedProj (Sprite2: Sprite, Time: number, Ident: number) {
    timer.after(Time, function () {
        if (Ident == 1) {
            ProjTrackII(Sprite2, mySprite.x, mySprite.y, 125)
            sprites.setDataBoolean(Sprite2, "Fatal?", true)
        } else if (Ident == 2) {
            Sprite2.ay = 500
            Sprite2.vy = 100
            tiles.placeOnTile(Sprite2, tiles.getTileLocation(mySprite.tilemapLocation().column + randint(-2, 2), 5))
            Sprite2.setFlag(SpriteFlag.DestroyOnWall, true)
            Sprite2.setFlag(SpriteFlag.GhostThroughWalls, false)
            Sprite2.setImage(assets.image`Missle`)
            Decoration = sprites.create(assets.image`Danger`, SpriteKind.Decor)
            Decoration.setFlag(SpriteFlag.Ghost, true)
            Decoration.lifespan = 800
            animation.runImageAnimation(
            Decoration,
            assets.animation`Happy13`,
            200,
            false
            )
            if (Sprite2.tilemapLocation().column <= 8 || Sprite2.tilemapLocation().column >= 22) {
                tiles.placeOnTile(Decoration, tiles.getTileLocation(Sprite2.tilemapLocation().column, 14))
            } else if (Sprite2.tilemapLocation().column <= 11 || Sprite2.tilemapLocation().column >= 19) {
                tiles.placeOnTile(Decoration, tiles.getTileLocation(Sprite2.tilemapLocation().column, 15))
            } else {
                tiles.placeOnTile(Decoration, tiles.getTileLocation(Sprite2.tilemapLocation().column, 16))
            }
        } else if (Ident == 3) {
            sprites.setDataBoolean(Sprite2, "Fatal?", true)
        } else if (Ident == 4) {
            for (let index = 0; index < 8; index++) {
                BossProjectile(8, true, false, 10000, assets.animation`Happy18`, image.create(7, 7), true)
                EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                EnemProj.setPosition(Sprite2.x, Sprite2.y)
                EnemProj.ay = 200
                ProjTrackII(EnemProj, Sprite2.x + randint(-64, 64), Sprite2.y + randint(-64, 64), 150)
            }
        } else if (Ident == 5) {
            Sprite2.ay = 0
            ProjTrackII(Sprite2, mySprite.x, mySprite.y, 150)
        } else if (Ident == 6) {
            for (let index = 0; index <= 2; index++) {
                BossProjectile(10, true, false, 10000, assets.animation`Boss4Bolt2`, image.create(8, 8), true)
                EnemProj.setPosition(Sprite2.x, Sprite2.y)
                EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                ProjTrackII(EnemProj, mySprite.x + randint(-12, 12), mySprite.y + randint(-12, 12), 150)
                pause(300)
                if (index == 0) {
                    pause(100)
                }
            }
        } else if (Ident == 7) {
            for (let index = 0; index < randint(5, 7); index++) {
                Sprite2.setVelocity(0, 0)
                Sprite2.ax = 0
                Sprite2.ay = 0
                BossProjectile(11, true, false, 10000, assets.animation`Boss4Bolt2`, image.create(8, 8), true)
                EnemProj.setPosition(Sprite2.x, Sprite2.y)
                EnemProj.setVelocity(randint(-50, 50), randint(-150, -250))
                EnemProj.ay = 400
                EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
            }
        } else if (Ident == 8) {
            sprites.setDataBoolean(Sprite2, "Fatal?", true)
            sprites.setDataNumber(Sprite2, "HP", 1000)
            PlateTitle(assets.image`PlateB5`)
            _5BossAttack(1, Sprite2)
        } else if (Ident == 9) {
            ProjTrackII(Sprite2, mySprite.x, mySprite.y, 125)
            Sprite2.fx = 0
            Sprite2.fy = 0
            sprites.setDataBoolean(Sprite2, "Fatal?", true)
            if (sprites.readDataNumber(Sprite2, "Damage") == 8) {
                timer.after(700, function () {
                    animation.stopAnimation(animation.AnimationTypes.All, Sprite2)
                    animation.runImageAnimation(
                    Sprite2,
                    assets.animation`MagicFade`,
                    100,
                    false
                    )
                })
            } else {
                timer.after(2300, function () {
                    animation.stopAnimation(animation.AnimationTypes.All, Sprite2)
                    animation.runImageAnimation(
                    Sprite2,
                    assets.animation`MagicFade`,
                    100,
                    false
                    )
                })
            }
        } else if (Ident == 10) {
            for (let index = 0; index <= 2; index++) {
                BossProjectile(8, true, true, 800, assets.animation`Boss7BoltC`, image.create(16, 16), false)
                EnemProj.setPosition(Sprite2.x, Sprite2.y)
                EnemProj.ay = 60
                if (index == 0) {
                    EnemProj.setVelocity(120, -60)
                } else if (index == 1) {
                    EnemProj.setVelocity(-120, -60)
                } else {
                    EnemProj.setVelocity(0, 120)
                }
            }
        } else if (Ident == 11) {
            for (let index = 0; index <= 3; index++) {
                BossProjectile(10, true, true, 800, assets.animation`Boss3BoltC`, image.create(16, 16), false)
                EnemProj.setPosition(Sprite2.x, Sprite2.y)
                EnemProj.ay = 60
                EnemProj.setVelocity(randint(-30, 30), randint(-30, 30))
                if (index == 0) {
                    EnemProj.vx = -150
                } else if (index == 1) {
                    EnemProj.vx = 150
                } else if (index == 2) {
                    EnemProj.vy = 150
                } else {
                    EnemProj.vy = -150
                }
            }
        } else if (Ident == 12) {
            for (let index = 0; index < 3; index++) {
                ProjTrackII(Sprite2, mySprite.x, mySprite.y, 200)
                animation.runImageAnimation(
                Sprite2,
                assets.animation`Boss8BoltDFollow`,
                100,
                false
                )
                pause(800)
            }
            animation.runImageAnimation(
            Sprite2,
            assets.animation`Boss8BoltDFade`,
            100,
            false
            )
        } else if (Ident == 13) {
            if (sprites.readDataNumber(Sprite2, "KBResistence") == 1) {
                animation.runImageAnimation(
                Sprite2,
                assets.animation`Boss8LHover`,
                100,
                true
                )
            } else {
                animation.runImageAnimation(
                Sprite2,
                assets.animation`Boss8RHover`,
                100,
                true
                )
            }
        } else if (Ident == 14) {
            sprites.setDataNumber(Sprite2, "Ident", randint(0, 1))
            for (let index = 0; index <= 3; index++) {
                BossProjectile(12, true, true, 800, [
                assets.animation`Boss6BoltC0`,
                assets.animation`Boss6BoltC1`,
                assets.animation`Boss6BoltC2`,
                assets.animation`Boss6BoltC3`,
                assets.animation`Boss6BoltC4`,
                assets.animation`Boss6BoltC5`,
                assets.animation`Boss6BoltC6`,
                assets.animation`Boss6BoltC7`
                ][index + sprites.readDataNumber(Sprite2, "Ident") * 4], image.create(16, 16), false)
                EnemProj.setPosition(Sprite2.x, Sprite2.y)
                EnemProj.fx = 150
                EnemProj.fy = 150
                if (sprites.readDataNumber(Sprite2, "Ident") == 0) {
                    if (index == 0) {
                        EnemProj.vx = -150
                    } else if (index == 1) {
                        EnemProj.vx = 150
                    } else if (index == 2) {
                        EnemProj.vy = 150
                    } else {
                        EnemProj.vy = -150
                    }
                } else {
                    if (index == 0) {
                        EnemProj.setVelocity(-106, -106)
                    } else if (index == 1) {
                        EnemProj.setVelocity(-106, 106)
                    } else if (index == 2) {
                        EnemProj.setVelocity(106, 106)
                    } else {
                        EnemProj.setVelocity(106, -106)
                    }
                }
            }
        } else if (Ident == 15) {
            for (let index = 0; index < 3; index++) {
                if (Time == 1) {
                    Sprite2.setPosition(scene.cameraProperty(CameraProperty.Left) + (36 + (sprites.readDataNumber(Sprite2, "KBResistence") - 1) % 4 * 21), scene.cameraProperty(CameraProperty.Top) + (35 + Math.floor((sprites.readDataNumber(Sprite2, "KBResistence") - 1) / 4) * 21))
                } else {
                    Sprite2.setPosition(scene.cameraProperty(CameraProperty.Left) + (36 + (sprites.readDataNumber(Sprite2, "Ident") - 1) % 4 * 21), scene.cameraProperty(CameraProperty.Top) + (35 + Math.floor((sprites.readDataNumber(Sprite2, "Ident") - 1) / 4) * 21))
                }
                pause(50)
            }
        } else if (Ident == 16) {
            Sprite2.vx = Sprite2.vx * 3
            timer.after(500, function () {
                Sprite2.vx = Sprite2.vx / 2
                timer.after(250, function () {
                    Sprite2.vx = Sprite2.vx / 1.5
                })
            })
        } else if (Ident == 17) {
        	
        } else {
        	
        }
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shopper, function (sprite, otherSprite) {
    sprites.setDataNumber(CameraSpr, "Ident", 4)
    Cursor.setFlag(SpriteFlag.Invisible, false)
    MoneyText.setFlag(SpriteFlag.Invisible, false)
    textSprite = textsprite.create("")
    textSprite.setIcon(assets.image`CostIcon`)
    textSprite.setFlag(SpriteFlag.Invisible, true)
    textSprite.z = 500
    pauseUntil(() => !(mySprite.overlapsWith(otherSprite)))
    sprites.setDataNumber(CameraSpr, "Ident", 1)
    Cursor.setFlag(SpriteFlag.Invisible, true)
    MoneyText.setFlag(SpriteFlag.Invisible, true)
    sprites.destroy(textSprite)
})
function _7BossAttack (Atk2: number) {
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (Atk2 == 1) {
            sprites.setDataNumber(Boss, "X", -64 + 128 * randint(0, 1))
            if (Math.percentChance(50)) {
                sprites.setDataNumber(Boss, "Y", -42)
                timer.after(100, function () {
                    DirectionalAnim(assets.animation`Boss7ARU`, assets.animation`Boss7ALU`, 100, false)
                })
            } else {
                sprites.setDataNumber(Boss, "Y", 42)
                timer.after(100, function () {
                    DirectionalAnim(assets.animation`Boss7ARD`, assets.animation`Boss7ALD`, 100, false)
                })
            }
            timer.after(600, function () {
                sprites.setDataBoolean(Boss, "Reloaded?", false)
                ProjTrackII(Boss, mySprite.x, mySprite.y, 300)
            })
            timer.after(1100, function () {
                Boss.setVelocity(0, 0)
                sprites.setDataBoolean(Boss, "Reloaded?", true)
                sprites.setDataNumber(Boss, "X", sprites.readDataNumber(Boss, "X") * -1)
                sprites.setDataNumber(Boss, "Y", sprites.readDataNumber(Boss, "Y") * -1)
            })
            timer.after(1600, function () {
                _7BossAttack(randint(1, 5))
            })
        } else if (Atk2 == 2) {
            sprites.setDataNumber(Boss, "X", -64 + 128 * randint(0, 1))
            sprites.setDataNumber(Boss, "Y", -42 + 84 * randint(0, 1))
            DirectionalAnim(assets.animation`Boss7B`, assets.animation`Boss7B`, 100, false)
            timer.after(700, function () {
                for (let index = 0; index <= 2; index++) {
                    BossProjectile(14, false, true, 1200, assets.animation`Boss7BoltA`, image.create(48, 144), false)
                    SpecifiedProj(EnemProj, 500, 3)
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(mySprite.tilemapLocation().column + randint(-4, 4), 0))
                    if (EnemProj.tilemapLocation().column >= 10 && EnemProj.tilemapLocation().column <= 16) {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 9))
                    } else {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 8))
                    }
                    pause(500)
                }
                timer.after(950, function () {
                    _7BossAttack(randint(1, 5))
                })
            })
        } else if (Atk2 == 3) {
            sprites.setDataNumber(Boss, "X", -72 + 144 * randint(0, 1))
            sprites.setDataNumber(Boss, "Y", 0)
            DirectionalAnim(assets.animation`Boss7C`, assets.animation`Boss7C`, 100, false)
            timer.after(500, function () {
                if (mySprite.x < Boss.x) {
                    BossProjectile(15, true, true, 2000, assets.animation`Boss7BoltBL`, image.create(80, 80), false)
                    EnemProj.vx = -150
                    EnemProj.ax = 150
                } else {
                    BossProjectile(15, true, true, 2000, assets.animation`Boss7BoltBR`, image.create(80, 80), false)
                    EnemProj.vx = 150
                    EnemProj.ax = -150
                }
                EnemProj.setPosition(Boss.x, Boss.y)
                timer.after(1000, function () {
                    _7BossAttack(randint(1, 5))
                })
            })
        } else if (Atk2 == 4) {
            sprites.setDataNumber(Boss, "X", -72 + 144 * randint(0, 1))
            sprites.setDataNumber(Boss, "Y", 0)
            DirectionalAnim(assets.animation`Boss7D`, assets.animation`Boss7D`, 100, false)
            timer.after(500, function () {
                if (mySprite.x < Boss.x) {
                    BossProjectile(15, true, true, 1200, assets.animation`Boss7BoltCL`, image.create(48, 48), false)
                    EnemProj.vx = -150
                    EnemProj.ax = 150
                } else {
                    BossProjectile(15, true, true, 1200, assets.animation`Boss7BoltCR`, image.create(48, 48), false)
                    EnemProj.vx = 150
                    EnemProj.ax = -150
                }
                EnemProj.setPosition(Boss.x, Boss.y)
                SpecifiedProj(EnemProj, 800, 10)
                timer.after(1000, function () {
                    _7BossAttack(randint(1, 5))
                })
            })
        } else if (Atk2 == 5) {
            if (sprites.readDataNumber(Boss, "HP") <= 150) {
                sprites.setDataNumber(Boss, "X", 0)
                sprites.setDataNumber(Boss, "Y", -56)
                DirectionalAnim(assets.animation`Boss7EA`, assets.animation`Boss7EA`, 100, false)
                timer.after(700, function () {
                    sprites.setDataBoolean(Boss, "Reloaded?", false)
                    Boss.vy = 300
                    Boss.setFlag(SpriteFlag.GhostThroughWalls, false)
                    pauseUntil(() => Boss.isHittingTile(CollisionDirection.Bottom))
                    animation.runImageAnimation(
                    Boss,
                    assets.animation`Boss7EB`,
                    100,
                    false
                    )
                    timer.after(600, function () {
                        sprites.setDataBoolean(Boss, "Reloaded?", true)
                        Boss.vy = 0
                        sprites.setDataNumber(Boss, "X", 0)
                        sprites.setDataNumber(Boss, "Y", -56)
                        Boss.setFlag(SpriteFlag.GhostThroughWalls, true)
                        timer.after(1000, function () {
                            _7BossAttack(randint(1, 5))
                        })
                    })
                })
            } else {
                _7BossAttack(randint(1, 4))
            }
        }
    }
}
function XChamberNum () {
    tiles.placeOnRandomTile(mySprite, assets.tile`BackBrick0`)
    Decoration = sprites.create(assets.image`GateO`, SpriteKind.Door)
    Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
    tiles.placeOnRandomTile(Decoration, assets.tile`BackBrick0`)
    Decoration = sprites.create(assets.image`GateC`, SpriteKind.Door)
    Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
    tiles.placeOnRandomTile(Decoration, assets.tile`BackBrick7`)
    Flood = sprites.create(assets.image`Flood`, SpriteKind.Deth)
    Flood.setFlag(SpriteFlag.GhostThroughWalls, true)
    Flood.vy = -6
    if (ListStorage[2] == ListStorage[17] * -1 + 11) {
        Flood.vy = Flood.vy * 1.5
    }
    Flood.z = 6
    tiles.placeOnTile(Flood, tiles.getTileLocation(0, mySprite.tilemapLocation().row + 15))
    for (let value of tiles.getTilesByType(assets.tile`BackBrick27`)) {
        Rung = sprites.create(assets.image`RungBox`, SpriteKind.Runging)
        Rung.setFlag(SpriteFlag.Invisible, true)
        tiles.placeOnTile(Rung, value)
    }
    for (let value of tiles.getTilesByType(assets.tile`Brick11`)) {
        if (ListStorage[2] == 8) {
            Decoration = sprites.create(assets.image`SpireBanner`, SpriteKind.Decor)
        } else {
            Decoration = sprites.create(assets.image`Banner`, SpriteKind.Decor)
        }
        Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
        Decoration.z = 5
        tiles.placeOnTile(Decoration, value)
        if (tiles.tileAtLocationEquals(value.getNeighboringLocation(CollisionDirection.Top), assets.tile`BackBrick46`)) {
            tiles.setTileAt(value, assets.tile`Floor1`)
        } else {
            tiles.setTileAt(value, assets.tile`Brick1`)
        }
    }
    for (let value of tiles.getTilesByType(assets.tile`BackBrick43`)) {
        tiles.setTileAt(value, assets.tile`transparency16`)
        Decoration = sprites.create(assets.image`Door`, SpriteKind.SwingDoor)
        Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
        tiles.placeOnTile(Decoration, value)
        for (let index = 0; index <= 2; index++) {
            tiles.setWallAt(tiles.getTileLocation(value.column, value.row - 1 + index), true)
        }
        Decoration = sprites.create(assets.image`BackBrix`, SpriteKind.Decor)
        Decoration.setFlag(SpriteFlag.GhostThroughWalls, true)
        tiles.placeOnTile(Decoration, value)
        Decoration.z = -1
        if (tiles.tileAtLocationEquals(tiles.getTileLocation(value.column, value.row - 1), assets.tile`BackBrick4`)) {
            sprites.destroy(Decoration)
            tiles.setTileAt(value, assets.tile`BackBrick4`)
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(value.column + 1, value.row), assets.tile`transparency16`)) {
            Decoration.image.fillRect(8, 0, 8, 48, 0)
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(value.column - 1, value.row), assets.tile`transparency16`)) {
            Decoration.image.fillRect(0, 0, 8, 48, 0)
        }
    }
}
function WeaponHoldImgs (Imgs: any[], Input: string, Subject: Sprite, SubjectB: Sprite) {
    for (let index = 0; index <= Imgs.length - 1; index++) {
        if (sprites.readDataNumber(SubjectB, Input) == index + 1) {
            Subject.setImage(Imgs[index])
        }
    }
}
sprites.onOverlap(SpriteKind.Camman, SpriteKind.Door, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.Decor)
    if (otherSprite.image.equals(assets.image`GateO`)) {
        timer.after(1000, function () {
            sprites.setDataBoolean(mySprite, "CanMove?", true)
            animation.runImageAnimation(
            otherSprite,
            assets.animation`GateClosing`,
            100,
            false
            )
        })
    } else {
        ListStorage[15] = 8
        sprites.setDataBoolean(mySprite, "Invincible?", true)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        animation.runImageAnimation(
        otherSprite,
        assets.animation`GateOpening`,
        100,
        false
        )
        timer.after(300, function () {
            mySprite.vx = 0
            animation.stopAnimation(animation.AnimationTypes.All, mySprite)
            if (sprites.readDataNumber(mySprite, "FacingLeft?") == 1) {
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolIdleLeft`,
                200,
                true
                )
            } else {
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolIdleRight`,
                200,
                true
                )
            }
            color.FadeToBlack.startScreenEffect(1000)
            timer.after(1700, function () {
                Overview(true)
                pauseUntil(() => browserEvents.MouseLeft.isPressed())
                if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3) {
                    Epilogue.ay = 75
                    Module.ay = 75
                    color.FadeToBlack.startScreenEffect(900)
                } else {
                    Epilogue.vy = 49
                    Epilogue.ay = -50
                    Module.vy = 49
                    Module.ay = -50
                }
                timer.after(1000, function () {
                    Module.ay = 0
                    Module.vy = 0
                    if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3) {
                        color.startFadeFromCurrent(color.originalPalette, 300)
                        sprites.destroy(Module)
                        sprites.destroy(Epilogue)
                        Epilogue = sprites.create(assets.image`EpiBlack`, SpriteKind.Decor)
                        Epilogue.setFlag(SpriteFlag.GhostThroughWalls, true)
                        Module = sprites.create(assets.image`Module3`, SpriteKind.Decor)
                        Module.vy = 49
                        Module.ay = -50
                        Module.y += 0
                        animation.runImageAnimation(
                        Module,
                        assets.animation`Air`,
                        100,
                        false
                        )
                        ListStorage[2] = ListStorage[2] + 1
                        if (ListStorage[2] > blockSettings.readNumber("MaxSector")) {
                            blockSettings.writeNumber("MaxSector", ListStorage[2])
                        }
                        ListStorage[1] = 0
                        timer.after(1000, function () {
                            Module.ay = 0
                            Module.vy = 0
                        })
                    } else if (ListMod[ListStorage[1] - 1] >= 0) {
                        Module = sprites.create(assets.image`Module2`, SpriteKind.Decor)
                        animation.runImageAnimation(
                        Module,
                        assets.animation`ModAscend`,
                        100,
                        false
                        )
                    } else {
                        if (ListMod[ListStorage[1] - 1] >= -3) {
                            Module = sprites.create(assets.image`Peak`, SpriteKind.Decor)
                            animation.runImageAnimation(
                            Module,
                            assets.animation`PeakAscend`,
                            100,
                            false
                            )
                            Module = sprites.create(assets.image`RedC`, SpriteKind.Decor)
                            if (ListMod[ListStorage[1] - 1] == -1) {
                                color.setColor(4, color.rgb(128, 0, 0))
                                animation.runImageAnimation(
                                Module,
                                assets.animation`RedCFlame`,
                                100,
                                false
                                )
                            } else if (ListMod[ListStorage[1] - 1] == -2) {
                                if (ListStorage[2] == 8) {
                                    color.setColor(4, color.parseColorString("#00dd84"))
                                    animation.runImageAnimation(
                                    Module,
                                    assets.animation`TurquoiseCSpire`,
                                    100,
                                    false
                                    )
                                    Module.x += -3
                                } else {
                                    animation.runImageAnimation(
                                    Module,
                                    assets.animation`GreenCShine`,
                                    100,
                                    false
                                    )
                                }
                            } else if (ListMod[ListStorage[1] - 1] == -3) {
                                color.setColor(6, color.rgb(0, 50, 196))
                                animation.runImageAnimation(
                                Module,
                                assets.animation`BlueCWater`,
                                100,
                                false
                                )
                            }
                        } else {
                            Module = sprites.create(assets.image`Module2`, SpriteKind.Decor)
                            animation.runImageAnimation(
                            Module,
                            assets.animation`ShopAscend`,
                            100,
                            false
                            )
                        }
                    }
                    Epilogue.top = 0
                    Epilogue.vy = 0
                    Epilogue.ay = 0
                    timer.after(800, function () {
                        color.FadeToBlack.startScreenEffect(1000)
                        ListStorage[15] = 9
                        timer.after(1200, function () {
                            sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
                            mySprite.setFlag(SpriteFlag.Invisible, false)
                            HpBar.setFlag(SpriteFlag.Invisible, false)
                            ManaBar.setFlag(SpriteFlag.Invisible, false)
                            Weapon.setFlag(SpriteFlag.Invisible, false)
                            DuraText.setFlag(SpriteFlag.Invisible, false)
                            mySprite.ay = 500
                            sprites.setDataBoolean(mySprite, "Invincible?", false)
                            sprites.setDataBoolean(mySprite, "Mark", false)
                            sprites.changeDataNumberBy(mySprite, "HP", 50 * ListEffects[0])
                            if (sprites.readDataNumber(mySprite, "HP") > 100 * ListEffects[5]) {
                                sprites.setDataNumber(mySprite, "HP", 100 * ListEffects[5])
                            }
                            ListStorage[0] = 0
                            for (let index = 0; index <= 4; index++) {
                                ListStorage[3 + index] = 0
                            }
                            ListStorage[10] = ListMod[ListStorage[1] - 1]
                            if (ListStorage[1] == 0) {
                                SectorSaver(ListStorage[2], false)
                            } else {
                                if (ListStorage[2] == 1) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerA-1`, tilemap`TowerA-2`, tilemap`TowerA-3`], 2, 3, 24)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerA-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerA2`,
                                        tilemap`TowerA3`,
                                        tilemap`TowerA4`,
                                        tilemap`TowerA5`,
                                        tilemap`TowerA6`,
                                        tilemap`TowerA7`
                                        ])
                                    }
                                } else if (ListStorage[2] == ListStorage[16]) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerB-1`, tilemap`TowerB-2`, tilemap`TowerB-3`], 2, 3, 24)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerB-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerB2`,
                                        tilemap`TowerB3`,
                                        tilemap`TowerB4`,
                                        tilemap`TowerB5`,
                                        tilemap`TowerB6`,
                                        tilemap`TowerB7`,
                                        tilemap`TowerB8`,
                                        tilemap`TowerB9`
                                        ])
                                    }
                                } else if (ListStorage[2] == ListStorage[16] * -1 + 5) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerC-1`, tilemap`TowerC-2`, tilemap`TowerC-3`], 2, 5, 24)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerC-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerC2`,
                                        tilemap`TowerC3`,
                                        tilemap`TowerC4`,
                                        tilemap`TowerC5`,
                                        tilemap`TowerC6`,
                                        tilemap`TowerC7`,
                                        tilemap`TowerC8`,
                                        tilemap`TowerC9`,
                                        tilemap`TowerC10`,
                                        tilemap`TowerC11`,
                                        tilemap`TowerC12`,
                                        tilemap`TowerC13`,
                                        tilemap`TowerC14`
                                        ])
                                    }
                                } else if (ListStorage[2] == 4) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerD-1`, tilemap`TowerD-2`, tilemap`TowerD-3`], 1, 3, 18)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerD-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerD2`,
                                        tilemap`TowerD3`,
                                        tilemap`TowerD4`,
                                        tilemap`TowerD5`,
                                        tilemap`TowerD6`,
                                        tilemap`TowerD7`,
                                        tilemap`TowerD8`,
                                        tilemap`TowerD9`
                                        ])
                                    }
                                } else if (ListStorage[2] == ListStorage[17]) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerE-1`, tilemap`TowerE-2`, tilemap`TowerE-3`], 16, 4, 36)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerE-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerE2`,
                                        tilemap`TowerE3`,
                                        tilemap`TowerE4`,
                                        tilemap`TowerE5`,
                                        tilemap`TowerE6`,
                                        tilemap`TowerE7`,
                                        tilemap`TowerE8`,
                                        tilemap`TowerE9`
                                        ])
                                    }
                                } else if (ListStorage[2] == ListStorage[17] * -1 + 11) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerF-1`, tilemap`TowerF-2`, tilemap`TowerF-3`], 0, 2, 32)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerF-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerF2`,
                                        tilemap`TowerF3`,
                                        tilemap`TowerF4`,
                                        tilemap`TowerF5`,
                                        tilemap`TowerF6`,
                                        tilemap`TowerF7`
                                        ])
                                    }
                                } else if (ListStorage[2] == 7) {
                                    if (ListStorage[10] <= -1 && ListStorage[10] >= -3) {
                                        SpirePeak([tilemap`TowerG-1`, tilemap`TowerG-2`, tilemap`TowerG-3`], 0, 4, 24)
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerG-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerG2`,
                                        tilemap`TowerG3`,
                                        tilemap`TowerG4`,
                                        tilemap`TowerG5`,
                                        tilemap`TowerG6`,
                                        tilemap`TowerG7`,
                                        tilemap`TowerG8`,
                                        tilemap`TowerG9`
                                        ])
                                    }
                                } else if (ListStorage[2] == 8) {
                                    if (ListStorage[10] == -2) {
                                        tiles.setCurrentTilemap(tilemap`TowerH99`)
                                        ListStorage[11] = 1
                                        timer.after(100, function () {
                                            Flood.top = scene.cameraProperty(CameraProperty.Bottom)
                                        })
                                        timer.after(700, function () {
                                            Flood.vy = 0
                                        })
                                    } else if (ListStorage[10] == -4) {
                                        ShopSummon([tilemap`TowerH-4`])
                                    } else {
                                        TileShift([
                                        tilemap`TowerH2`,
                                        tilemap`TowerH3`,
                                        tilemap`TowerH4`,
                                        tilemap`TowerH5`,
                                        tilemap`TowerH6`,
                                        tilemap`TowerH7`,
                                        tilemap`TowerH8`,
                                        tilemap`TowerH9`,
                                        tilemap`TowerH10`
                                        ])
                                    }
                                }
                            }
                            ListStorage[1] = ListStorage[1] + 1
                            EnemySpawn()
                            XChamberNum()
                            tiles.placeOnRandomTile(CameraSpr, assets.tile`BackBrick0`)
                            color.setPalette(
                            color.originalPalette
                            )
                            SectorSaver(0, true)
                        })
                    })
                })
            })
        })
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick51`, function (sprite, location) {
    for (let value of tiles.getTilesByType(assets.tile`BackBrick51`)) {
        tiles.setTileAt(value, assets.tile`BackBrick1`)
    }
    if (ListStorage[2] == 4) {
        tiles.placeOnTile(mySprite, location)
        sprites.setDataNumber(CameraSpr, "Ident", 2)
        CameraAnchor = sprites.create(assets.image`Camma`, SpriteKind.Decor)
        CameraAnchor.setFlag(SpriteFlag.GhostThroughWalls, true)
        CameraAnchor.setFlag(SpriteFlag.Invisible, true)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        sprites.setDataBoolean(mySprite, "CanDash?", false)
        mySprite.vx = 0
        animation.runImageAnimation(
        mySprite,
        assets.animation`IsolIdleRight`,
        200,
        true
        )
        timer.after(1500, function () {
            animation.runImageAnimation(
            Boss,
            assets.animation`King-2`,
            100,
            false
            )
        })
        timer.after(5000, function () {
            tiles.setTileAt(mySprite.tilemapLocation(), assets.tile`BackBrick11`)
            sprites.setDataBoolean(mySprite, "CanMove?", true)
            sprites.setDataBoolean(mySprite, "CanDash?", true)
            Enemies(160, 70, 9, 16, Enemy1, randint(12, 16), assets.animation`Enemy9Spawn`, assets.image`EnemyTest`)
            EnemyGround(20, -1)
            tiles.placeOnTile(Enemy1, tiles.getTileLocation(46, 22))
            Enemies(75, 75, 2, 12, Enemy1, randint(3, 8), assets.animation`Enemy2Spawn`, assets.image`Enemy2`)
            tiles.placeOnTile(Enemy1, tiles.getTileLocation(42, 21))
            timer.after(600, function () {
                sprites.setDataNumber(CameraSpr, "Ident", 1)
                sprites.destroy(CameraAnchor)
                Boss.vx = 200
                Boss.ay = 100
                Boss.vy = -80
                Boss.lifespan = 1000
            })
        })
    } else {
        for (let value of tiles.getTilesByType(assets.tile`BackBrick20`)) {
            tiles.setTileAt(value, assets.tile`BackBrick77`)
            scene.cameraShake(3, 300)
            Flood.vy = -18
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`Floor2`, function (sprite, location) {
    if (location.row == 0) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.BossEnemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        sprites.destroyAllSpritesOfKind(SpriteKind.Door)
        sprites.destroyAllSpritesOfKind(SpriteKind.SwingDoor)
        sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
        sprites.destroyAllSpritesOfKind(SpriteKind.$$$)
        tiles.placeOnTile(mySprite, tiles.getTileLocation(14, 10))
        tiles.placeOnTile(CameraSpr, tiles.getTileLocation(14, 14))
        CameraSpr.y += 8
        tiles.setCurrentTilemap(tilemap`TowerH100`)
        Flood.y = 389
        CameraSpr.vy = -64
        timer.after(5500, function () {
            Flood.vy = 0
        })
        Decoration = sprites.create(assets.image`SpireTop`, SpriteKind.Decor)
        Decoration.setFlag(SpriteFlag.Ghost, true)
        tiles.placeOnTile(Decoration, tiles.getTileLocation(14, 5))
        Decoration.z = -998
        Boss = sprites.create(assets.image`Boss8`, SpriteKind.BossEnemy)
        SubBoss = sprites.create(assets.image`TheEye`, SpriteKind.Decor)
        tiles.placeOnTile(SubBoss, tiles.getTileLocation(-3, -3))
        BossSpawning(3000, 0, 0, 0, assets.animation`Boss8CIdle`, tiles.getTileLocation(14, 7))
        timer.after(2000, function () {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss8CRotate`,
            200,
            false
            )
            animation.runImageAnimation(
            SubBoss,
            assets.animation`Boss8ERotate`,
            200,
            false
            )
            tiles.placeOnTile(SubBoss, tiles.getTileLocation(14, 7))
            sprites.setDataNumber(CameraSpr, "Ident", 2)
            CameraAnchor = sprites.create(assets.image`Camma`, SpriteKind.Decor)
            CameraAnchor.setFlag(SpriteFlag.GhostThroughWalls, true)
            CameraAnchor.setFlag(SpriteFlag.Invisible, true)
            timer.after(1800, function () {
                PlateTitle(assets.image`PlateB8`)
                NamePlate.y += 90
            })
            timer.after(4200, function () {
                animation.runImageAnimation(
                Boss,
                assets.animation`Boss8C`,
                150,
                true
                )
                sprites.setDataNumber(Boss, "HP", 3000)
                _8BossAttack(1, false)
            })
        })
    } else if (ListStorage[2] == ListStorage[17] * -1 + 11 && (ListMod[ListStorage[1] - 2] == -1 && mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`))) {
        for (let value of tiles.getTilesByType(assets.tile`Floor2`)) {
            tiles.setTileAt(value, assets.tile`Floor3`)
            tiles.setWallAt(value, true)
        }
        tiles.placeOnTile(Flood, tiles.getTileLocation(mySprite.x / 16, 24))
        Flood.vy = -32
        timer.after(3000, function () {
            Flood.vy = 0
            timer.after(1000, function () {
                Boss = sprites.create(assets.image`Boss6`, SpriteKind.BossEnemy)
                Boss.setFlag(SpriteFlag.GhostThroughWalls, true)
                Boss.fy = 200
                BossSpawning(1400, 14, 1000, 60, assets.animation`Boss6Spawn`, tiles.getTileLocation(14, 13))
                timer.after(300, function () {
                    Boss.vy = -200
                    while (sprites.readDataNumber(Boss, "HP") > 0 && sprites.readDataNumber(mySprite, "HP") > 0) {
                        color.setColor(1, color.parseColorString("#404040"), 1400)
                        pause(2000)
                        color.setColor(1, color.parseColorString("#e6e6e6"), 1400)
                        pause(2000)
                    }
                })
                timer.after(2000, function () {
                    sprites.setDataBoolean(Boss, "Fatal?", true)
                    sprites.setDataNumber(Boss, "HP", 1400)
                    PlateTitle(assets.image`PlateB6`)
                    Boss6Attack(1)
                })
            })
        })
    } else {
    	
    }
})
function EnemyDeath (otherSprite: Sprite) {
    for (let index = 0; index < sprites.readDataNumber(otherSprite, "Money"); index++) {
        Coin = sprites.create(assets.image`Opal`, SpriteKind.Un$$$)
        Coin.setPosition(otherSprite.x, otherSprite.y)
        Coin.setVelocity(randint(-100, 100), randint(-200, 100))
        Coin.ay = 500
        Coin.setBounceOnWall(true)
    }
    if (otherSprite.kind() == SpriteKind.BossEnemy) {
        animation.stopAnimation(animation.AnimationTypes.All, otherSprite)
        sprites.destroyAllSpritesOfKind(SpriteKind.DethProj)
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy, effects.disintegrate, 500)
        sprites.setDataBoolean(otherSprite, "Fatal?", false)
        if (!(ListStorage[2] == ListStorage[17] && sprites.readDataNumber(otherSprite, "Damage") <= 14)) {
            sprites.setDataNumber(mySprite, "HP", 100)
        }
        if (ListStorage[2] == 1) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1Death`,
            100,
            false
            )
            Boss.lifespan = 1300
        } else if (ListStorage[2] == ListStorage[16]) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Happy21`,
            100,
            false
            )
        } else if (ListStorage[2] == ListStorage[16] * -1 + 5) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss3Death`,
            100,
            false
            )
            color.setColor(6, color.parseColorString("#14595d"))
            color.setColor(7, color.parseColorString("#348d54"))
        } else if (ListStorage[2] == 4) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss4Death`,
            100,
            false
            )
            sprites.setDataNumber(CameraSpr, "Ident", 1)
            sprites.destroy(CameraAnchor)
        } else if (ListStorage[2] == ListStorage[17]) {
            animation.runImageAnimation(
            otherSprite,
            assets.animation`Boss5ADeath`,
            100,
            false
            )
            for (let value of sprites.allOfKind(SpriteKind.BossEnemy)) {
                if (sprites.readDataNumber(value, "Damage") == 15) {
                    timer.after(1500, function () {
                        animation.runImageAnimation(
                        value,
                        assets.animation`Boss5BDeath`,
                        100,
                        false
                        )
                        value.lifespan = 3400
                    })
                }
                sprites.setDataNumber(value, "Damage", 15)
            }
        } else if (ListStorage[2] == ListStorage[17] * -1 + 11) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss6Death`,
            100,
            false
            )
            Boss.lifespan = 500
            Flood.vy = 32
        } else if (ListStorage[2] == 7) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss7Death`,
            100,
            false
            )
            Boss.lifespan = 500
            scroller.setLayerImage(scroller.BackgroundLayer.Layer3, assets.image`Light`)
            for (let value of tiles.getTilesByType(assets.tile`BackBrick36`)) {
                tiles.setTileAt(value, assets.tile`BackBrick3`)
            }
        } else if (ListStorage[2] == 8) {
            SpireConclude()
        }
    } else {
        sprites.destroy(otherSprite)
    }
    ListStorage[4] = ListStorage[4] + 1
    if (sprites.readDataBoolean(otherSprite, "Mark")) {
        ListStorage[8] = ListStorage[8] - 1
        if (ListStorage[8] == 0) {
            if (ListMod[ListStorage[1] - 2] == -2) {
                ListStorage[11] = ListStorage[11] - 1
                if (ListStorage[11] > 0) {
                    sprites.setDataBoolean(mySprite, "Mark", true)
                    Enemies(75, 75, 2, 8, Enemy1, randint(5, 8), assets.animation`Enemy2Spawn`, assets.image`Enemy2`)
                    tiles.placeOnRandomTile(Enemy1, assets.tile`BackBrick13`)
                    sprites.setDataBoolean(Enemy1, "Mark", true)
                    Summoner(1, assets.tile`Brick3`, assets.tile`Brick3`, 50)
                    Summoner(2, assets.tile`BackBrick13`, assets.tile`BackBrick13`, 50)
                    Summoner(4, assets.tile`BackBrick14`, assets.tile`BackBrick14`, 50)
                    if (ListStorage[2] == 1) {
                        for (let value of tiles.getTilesByType(assets.tile`Wood0`)) {
                            tiles.setTileAt(value, assets.tile`Wood`)
                            tiles.setWallAt(value, true)
                        }
                    } else if (ListStorage[2] == ListStorage[16]) {
                        Summoner(5, assets.tile`BackBrick21`, assets.tile`BackBrick21`, 50)
                    } else if (ListStorage[2] == ListStorage[16] * -1 + 5) {
                        Summoner(7, assets.tile`BackBrick21`, assets.tile`BackBrick21`, 50)
                        Summoner(8, assets.tile`BackBrick36`, assets.tile`BackBrick36`, 50)
                    } else if (ListStorage[2] == 4) {
                        Summoner(9, assets.tile`BackBrick44`, assets.tile`BackBrick44`, 50)
                        Summoner(10, assets.tile`BackBrick36`, assets.tile`BackBrick36`, 50)
                    } else if (ListStorage[2] == ListStorage[17]) {
                        Summoner(11, assets.tile`BackBrick54`, assets.tile`BackBrick54`, 50)
                        Summoner(12, assets.tile`BackBrick36`, assets.tile`BackBrick36`, 50)
                        Summoner(12, assets.tile`BackBrick42`, assets.tile`BackBrick42`, 50)
                    } else if (ListStorage[2] == ListStorage[17] * -1 + 11) {
                        Summoner(13, assets.tile`BackBrick36`, assets.tile`BackBrick36`, 50)
                        Summoner(14, assets.tile`BackBrick42`, assets.tile`BackBrick42`, 50)
                        Summoner(1, assets.tile`myTile5`, assets.tile`myTile5`, 50)
                    } else if (ListStorage[2] == 7) {
                        Summoner(15, assets.tile`BackBrick3`, assets.tile`BackBrick3`, 50)
                        Summoner(16, assets.tile`BackBrick33`, assets.tile`BackBrick33`, 50)
                        Summoner(16, assets.tile`BackBrick35`, assets.tile`BackBrick35`, 50)
                        Summoner(2, assets.tile`BackBrick42`, assets.tile`BackBrick42`, 50)
                        Summoner(1, assets.tile`myTile5`, assets.tile`myTile5`, 50)
                    }
                    timer.after(500, function () {
                        sprites.setDataBoolean(mySprite, "Mark", false)
                    })
                } else {
                    for (let value of tiles.getTilesByType(assets.tile`BackBrick12`)) {
                        tiles.setTileAt(value, assets.tile`BackBrick10`)
                        tiles.setWallAt(value, false)
                    }
                    for (let value of tiles.getTilesByType(assets.tile`Floor3`)) {
                        tiles.setTileAt(value, assets.tile`Floor0`)
                        tiles.setWallAt(value, false)
                    }
                    for (let value of tiles.getTilesByType(assets.tile`BackBrick29`)) {
                        tiles.setTileAt(value, assets.tile`BackBrick15`)
                    }
                }
            } else {
                for (let value of tiles.getTilesByType(assets.tile`BackBrick12`)) {
                    tiles.setTileAt(value, assets.tile`BackBrick10`)
                    tiles.setWallAt(value, false)
                }
                for (let value of tiles.getTilesByType(assets.tile`Floor3`)) {
                    tiles.setTileAt(value, assets.tile`Floor2`)
                    tiles.setWallAt(value, false)
                }
                for (let value of tiles.getTilesByType(assets.tile`BackBrick29`)) {
                    tiles.setTileAt(value, assets.tile`BackBrick15`)
                }
            }
        }
    }
}
function DirectionalAnim (LeftAnim: any[], RightAnim: any[], Framerate: number, Loop: boolean) {
    if (mySprite.x - Boss.x < 0) {
        sprites.setDataNumber(Boss, "FacingLeft?", 1)
        animation.runImageAnimation(
        Boss,
        LeftAnim,
        Framerate,
        Loop
        )
    } else {
        sprites.setDataNumber(Boss, "FacingLeft?", 0)
        animation.runImageAnimation(
        Boss,
        RightAnim,
        Framerate,
        Loop
        )
    }
}
function DeathText (Death2: string) {
    textSprite = textsprite.create("" + Death2 + " on Floor " + convertToText(ListStorage[1]), 0, 2)
}
function DethMessage (Sector: number, Dialogue: string[], SecondLine: string[], Secret1: string, Secret2: string, SecretCondition: boolean) {
    if (ListStorage[2] == Sector) {
        text_list = randint(0, 2)
        if (SecretCondition) {
            textSprite = textsprite.create(Secret1, 0, 1)
            textSprite2 = textsprite.create(Secret2, 0, 1)
            if (ListStorage[2] == ListStorage[16]) {
                for (let index = 0; index <= 1; index++) {
                    Decoration = sprites.create(assets.image`LL`, SpriteKind.Decor)
                    Decoration.setPosition(108 + index * 6, 73)
                }
            }
        } else {
            textSprite = textsprite.create(Dialogue[text_list], 0, 1)
            textSprite2 = textsprite.create(SecondLine[text_list], 0, 1)
        }
        textSprite.setPosition(80, 60)
        textSprite2.setPosition(80, 70)
        textSprite.setOutline(1, 1)
        textSprite2.setOutline(1, 1)
        timer.after(750, function () {
            textSprite.setOutline(1, 13)
            textSprite2.setOutline(1, 13)
            timer.after(750, function () {
                textSprite.setOutline(1, 12)
                textSprite2.setOutline(1, 12)
                timer.after(750, function () {
                    textSprite.setOutline(1, 14)
                    textSprite2.setOutline(1, 14)
                })
            })
        })
    }
}
function THETA () {
    color.setColor(6, color.rgb(0, 128, 64))
    color.setColor(7, color.rgb(0, 255, 128))
    color.setColor(9, color.rgb(0, 192, 96))
    color.setColor(10, color.rgb(0, 64, 32))
    color.setColor(15, color.rgb(0, 16, 8))
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`THETA0`)
    scroller.scrollBackgroundWithSpeed(0, 15, scroller.BackgroundLayer.Layer0)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`THETA1`)
    pause(1200)
    color.FadeToBlack.startScreenEffect(300)
    pause(500)
    scroller.scrollBackgroundWithSpeed(0, 0, scroller.BackgroundLayer.Layer0)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`THETA0B`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`THETA1B`)
    scroller.setBackgroundScrollOffset(0, 0, scroller.BackgroundLayer.Layer0)
    color.startFadeFromCurrent(color.originalPalette, 400)
}
function Boss6Attack (Atk2: number) {
    if (Atk2 > 3) {
        if (Boss.vx < 0 && Boss.x < mySprite.x) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss6R`,
            100,
            false
            )
            pause(250)
            Boss.vx = 60
            pause(250)
        } else if (Boss.vx > 0 && Boss.x > mySprite.x) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss6L`,
            100,
            false
            )
            pause(250)
            Boss.vx = -50
            pause(250)
        }
    }
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (sprites.readDataNumber(Boss, "Damage") == 14 && sprites.readDataNumber(Boss, "HP") <= 700) {
            sprites.setDataNumber(Boss, "Damage", 15)
            Flood.vy = -8
            timer.after(6000, function () {
                Flood.vy = 0
            })
        }
        if (Atk2 == 1) {
            DirectionalAnim(assets.animation`Boss6A`, assets.animation`Boss6A`, 100, false)
            timer.after(200, function () {
                sprites.setDataBoolean(Boss, "Fatal?", false)
                tiles.placeOnTile(Boss, tiles.getTileLocation(mySprite.tilemapLocation().column, 9))
                if (mySprite.tilemapLocation().column <= 15 && mySprite.tilemapLocation().column >= 13) {
                    tiles.placeOnTile(Boss, tiles.getTileLocation(mySprite.tilemapLocation().column, 8))
                }
                timer.after(600, function () {
                    sprites.setDataBoolean(Boss, "Fatal?", true)
                    timer.after(1100, function () {
                        sprites.setDataBoolean(Boss, "Fatal?", false)
                        tiles.placeOnTile(Boss, tiles.getTileLocation(randint(6, 22), randint(6, 9)))
                        timer.after(300, function () {
                            sprites.setDataBoolean(Boss, "Fatal?", true)
                        })
                    })
                })
            })
            for (let index = 0; index < 5; index++) {
                BossProjectile(14, false, true, 6700, assets.animation`Boss6BoltA`, image.create(19, 61), true)
                SpecifiedProj(EnemProj, 600, 3)
                if (Math.percentChance(50)) {
                    if (Math.percentChance(50)) {
                        tiles.placeOnRandomTile(EnemProj, assets.tile`myTile0`)
                    } else {
                        tiles.placeOnRandomTile(EnemProj, assets.tile`myTile1`)
                    }
                } else {
                    if (Math.percentChance(50)) {
                        tiles.placeOnRandomTile(EnemProj, assets.tile`BackBrick23`)
                    } else {
                        tiles.placeOnRandomTile(EnemProj, assets.tile`myTile5`)
                    }
                }
                EnemProj.y += -21
            }
            timer.after(2500, function () {
                Boss6Attack(randint(1, 3))
            })
        } else if (Atk2 == 2) {
            for (let index = 0; index < 5; index++) {
                BossProjectile(14, false, true, 900, assets.animation`Boss6BoltB`, image.create(21, 21), false)
                tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(6, 22), 14))
                EnemProj.vy = randint(-300, -100)
                EnemProj.fy = 200
                SpecifiedProj(EnemProj, 800, 14)
                pause(400)
            }
            timer.after(3000, function () {
                Boss6Attack(randint(1, 3))
            })
        } else if (Atk2 == 3) {
            DirectionalAnim(assets.animation`Boss6C`, assets.animation`Boss6C`, 100, false)
            Boss.ay = 250
            timer.after(1000, function () {
                Boss.ay = 0
                Boss.vy = 0
                tiles.placeOnTile(Boss, tiles.getTileLocation(3, randint(6, 8)))
                Boss.vx = 60
                if (!(mySprite.tilemapLocation().column >= 18) && (mySprite.tilemapLocation().column <= 9 || Math.percentChance(50))) {
                    tiles.placeOnTile(Boss, tiles.getTileLocation(25, randint(6, 8)))
                    Boss.vx = -60
                }
                DirectionalAnim(assets.animation`Boss6CL2`, assets.animation`Boss6CR2`, 100, true)
            })
            timer.after(2500, function () {
                Boss6Attack(randint(4, 4))
                Boss.fy = 200
            })
        } else if (Atk2 == 4) {
            DirectionalAnim(assets.animation`Boss6DL`, assets.animation`Boss6DR`, 100, false)
            timer.after(500, function () {
                for (let index = 0; index < 2; index++) {
                    BossProjectile(14, false, true, 900, assets.animation`Boss6BoltB`, image.create(21, 21), false)
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(6, 22), 14))
                    EnemProj.vy = randint(-300, -100)
                    EnemProj.fy = 200
                    SpecifiedProj(EnemProj, 800, 14)
                    pause(100)
                }
            })
            timer.after(1200, function () {
                Boss6Attack(randint(4, 6))
            })
        } else if (Atk2 == 5) {
            DirectionalAnim(assets.animation`Boss6EL`, assets.animation`Boss6ER`, 100, false)
            timer.after(700, function () {
                Boss.vx = 0
                tiles.placeOnTile(Boss, tiles.getTileLocation(mySprite.tilemapLocation().column + randint(-2, 2), 14))
                DirectionalAnim(assets.animation`Boss6Spawn`, assets.animation`Boss6Spawn`, 100, false)
                timer.after(350, function () {
                    Boss.vy = -400
                    Boss.fy = 600
                })
                timer.after(1500, function () {
                    Boss6Attack(randint(1, 2))
                })
            })
        } else if (Atk2 == 6) {
            DirectionalAnim(assets.animation`Boss6FL`, assets.animation`Boss6FR`, 100, false)
            BossProjectile(18, true, true, 1300, assets.animation`Boss6BoltE`, image.create(80, 80), false)
            EnemProj.setPosition(Boss.x, Boss.y)
            EnemProj.vx = Boss.vx
            SpecifiedProj(EnemProj, 300, 16)
            BossProjectile(18, true, true, 1300, assets.animation`Boss6BoltF`, image.create(80, 80), false)
            EnemProj.setPosition(Boss.x, Boss.y)
            EnemProj.vx = Boss.vx
            EnemProj.z = 501
            SpecifiedProj(EnemProj, 300, 16)
            SpecifiedProj(Boss, 300, 16)
            timer.after(2550, function () {
                Boss6Attack(randint(4, 6))
            })
        }
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick78`, function (sprite, location) {
    if (browserEvents.MouseLeft.isPressed()) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        tiles.setTileAt(location, assets.tile`myTile18`)
        ListStorage[7] = ListStorage[7] + 1
        ListStorage[3] = ListStorage[3] + 1
        DroppedItem = sprites.create(assets.image`Weapon1`, SpriteKind.Drop)
        sprites.setDataNumber(DroppedItem, "Type", 2)
        tiles.placeOnTile(DroppedItem, location)
        ItemFly(DroppedItem)
        sprites.setDataNumber(DroppedItem, "Ident", randint(1, 16))
        WeaponHoldImgs(ListItems, "Ident", DroppedItem, DroppedItem)
    }
})
function _8BossAttack (Atk2: number, Phase: boolean) {
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (sprites.readDataNumber(Boss, "Damage") == 0 && sprites.readDataNumber(Boss, "HP") <= 2000 || sprites.readDataNumber(Boss, "Damage") == 2 && sprites.readDataNumber(Boss, "HP") <= 1000) {
            DuelrectionalAnim(SubBoss, assets.animation`Boss8ESummon0`, assets.animation`Boss8ESummon0`, 100, false)
            Enemies(200, 120, 17, 16, Enemy1, randint(14, 20), assets.animation`Enemy17Spawn`, assets.image`EnemyTest`)
            EnemyGround(25, -1)
            tiles.placeOnTile(Enemy1, tiles.getTileLocation(9 + sprites.readDataNumber(Boss, "Damage") * 5, 9))
            Enemies(150, 160, 18, 12, Enemy1, randint(14, 20), assets.animation`Enemy18Spawn`, assets.image`Enemy18`)
            tiles.placeOnTile(Enemy1, tiles.getTileLocation(19 - sprites.readDataNumber(Boss, "Damage") * 5, 8))
            sprites.changeDataNumberBy(Boss, "Damage", 1)
            timer.after(800, function () {
                if (Phase) {
                    _8BossAttack(randint(1, 8), true)
                } else {
                    _8BossAttack(randint(1, 5), sprites.readDataNumber(Boss, "HP") <= 1500)
                }
            })
        } else if (sprites.readDataNumber(Boss, "Damage") == 1 && sprites.readDataNumber(Boss, "HP") <= 1500) {
            DuelrectionalAnim(SubBoss, assets.animation`Boss8EHands`, assets.animation`Boss8EHands`, 100, false)
            sprites.changeDataNumberBy(Boss, "Damage", 1)
            for (let index = 0; index <= 1; index++) {
                SubBossB = sprites.create(assets.image`Boss8L`, SpriteKind.BossEnemy)
                animation.runImageAnimation(
                SubBossB,
                [assets.animation`Boss8LAppear`, assets.animation`Boss8RAppear`][index],
                100,
                false
                )
                SpecifiedProj(SubBossB, 300, 13)
                sprites.setDataNumber(SubBossB, "HP", 10001)
                sprites.setDataNumber(SubBossB, "Damage", 24)
                sprites.setDataNumber(SubBossB, "KBResistence", index + 1)
                tiles.placeOnTile(SubBossB, tiles.getTileLocation(Boss.tilemapLocation().column - 3 + index * 6, Boss.tilemapLocation().row))
                sprites.setDataBoolean(SubBossB, "Fatal?", false)
            }
            timer.after(1200, function () {
                _8BossAttack(randint(1, 8), true)
            })
        } else {
            if (Atk2 == 1) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EAA`, assets.animation`Boss8EAA`, 100, false)
                timer.after(600, function () {
                    DuelrectionalAnim(SubBoss, assets.animation`Boss8EAB`, assets.animation`Boss8EAB`, 100, true)
                })
                for (let index = 0; index < randint(12, 16); index++) {
                    BossProjectile(18, false, true, 900, assets.animation`Boss8BoltA`, image.create(16, 176), false)
                    SpecifiedProj(EnemProj, 600, 3)
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(6, 22), 0))
                    if (EnemProj.tilemapLocation().column <= 7 || EnemProj.tilemapLocation().column >= 21) {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 3))
                    } else if (EnemProj.tilemapLocation().column <= 10 || EnemProj.tilemapLocation().column >= 18) {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 4))
                    } else {
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 5))
                    }
                    pause(randint(50, 200))
                }
                animation.stopAnimation(animation.AnimationTypes.All, SubBoss)
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EAC`, assets.animation`Boss8EAC`, 100, false)
                timer.after(600, function () {
                    if (Phase) {
                        _8BossAttack(randint(1, 8), true)
                    } else {
                        _8BossAttack(randint(1, 5), sprites.readDataNumber(Boss, "HP") <= 1500)
                    }
                })
            } else if (Atk2 == 2) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EB`, assets.animation`Boss8EB`, 100, false)
                for (let index = 0; index < randint(1, 3); index++) {
                    BossProjectile(25, false, true, 300000, assets.animation`Boss8BoltB`, image.create(65, 65), false)
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(6, 22), randint(5, 10)))
                    sprites.setDataNumber(EnemProj, "Ident", 8)
                    EnemProj.z = -999
                }
                timer.after(1000, function () {
                    if (Phase) {
                        _8BossAttack(randint(1, 8), true)
                    } else {
                        _8BossAttack(randint(1, 5), sprites.readDataNumber(Boss, "HP") <= 1500)
                    }
                })
            } else if (Atk2 == 3) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EC`, assets.animation`Boss8EC`, 100, false)
                for (let value of sprites.allOfKind(SpriteKind.DethProj)) {
                    if (sprites.readDataNumber(value, "Ident") == 8) {
                        EnemProj.z = 1
                        animation.runImageAnimation(
                        value,
                        assets.animation`Boss8BoltBExplode`,
                        100,
                        false
                        )
                        SpecifiedProj(value, 800, 3)
                        value.lifespan = 1300
                    }
                }
                timer.after(1200, function () {
                    if (Phase) {
                        _8BossAttack(randint(1, 8), true)
                    } else {
                        if (Math.percentChance(50)) {
                            _8BossAttack(randint(1, 2), sprites.readDataNumber(Boss, "HP") <= 1500)
                        } else {
                            _8BossAttack(randint(4, 5), sprites.readDataNumber(Boss, "HP") <= 1500)
                        }
                    }
                })
            } else if (Atk2 == 4) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8ED`, assets.animation`Boss8ED`, 100, false)
                for (let index = 0; index < 3; index++) {
                    BossProjectile(15, true, true, 3400, assets.animation`Boss8BoltD`, image.create(15, 15), false)
                    EnemProj.setPosition(Boss.x, Boss.y)
                    EnemProj.fx = 300
                    EnemProj.fy = 300
                    ProjTrackII(EnemProj, Boss.x + randint(-10, 10), Boss.y + randint(-10, 10), 200)
                    SpecifiedProj(EnemProj, 800, 12)
                }
                timer.after(3200, function () {
                    if (Phase) {
                        _8BossAttack(randint(1, 8), true)
                    } else {
                        _8BossAttack(randint(1, 5), sprites.readDataNumber(Boss, "HP") <= 1500)
                    }
                })
            } else if (Atk2 == 5) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EEL`, assets.animation`Boss8EER`, 100, false)
                timer.after(500, function () {
                    for (let index = 0; index < 10; index++) {
                        BossProjectile(18, false, true, 900, assets.animation`Boss8BoltA`, image.create(16, 176), false)
                        SpecifiedProj(EnemProj, 600, 3)
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(6, 22), 0))
                        if (EnemProj.tilemapLocation().column <= 7 || EnemProj.tilemapLocation().column >= 21) {
                            tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 3))
                        } else if (EnemProj.tilemapLocation().column <= 10 || EnemProj.tilemapLocation().column >= 18) {
                            tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 4))
                        } else {
                            tiles.placeOnTile(EnemProj, tiles.getTileLocation(EnemProj.tilemapLocation().column, 5))
                        }
                        BossProjectile(16, false, true, 700, assets.animation`SpireMark`, image.create(15, 15), false)
                        SpecifiedProj(EnemProj, 500, 3)
                        EnemProj.z = 2
                        EnemProj.setPosition(mySprite.x, mySprite.y)
                        pause(400)
                    }
                    timer.after(400, function () {
                        if (Phase) {
                            _8BossAttack(randint(1, 8), true)
                        } else {
                            _8BossAttack(randint(1, 5), sprites.readDataNumber(Boss, "HP") <= 1500)
                        }
                    })
                })
            } else if (Atk2 == 6) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EF`, assets.animation`Boss8EF`, 100, false)
                animation.stopAnimation(animation.AnimationTypes.All, Boss)
                DuelrectionalAnim(Boss, assets.animation`Boss8CF`, assets.animation`Boss8CF`, 100, false)
                for (let value of sprites.allOfKind(SpriteKind.BossEnemy)) {
                    if (sprites.readDataNumber(value, "KBResistence") >= 1) {
                        animation.stopAnimation(animation.AnimationTypes.All, value)
                        animation.runImageAnimation(
                        value,
                        [assets.animation`Boss8LPhase0`, assets.animation`Boss8RPhase`][sprites.readDataNumber(value, "KBResistence") - 1],
                        100,
                        false
                        )
                        timer.after(380, function () {
                            tiles.placeOnTile(value, tiles.getTileLocation(Boss.tilemapLocation().column - 3 + (sprites.readDataNumber(value, "KBResistence") - 1) * 6, Boss.tilemapLocation().row))
                        })
                        SpecifiedProj(value, 700, 13)
                    }
                }
                timer.after(350, function () {
                    if (Math.percentChance(33)) {
                        tiles.placeOnTile(Boss, tiles.getTileLocation(9, 6))
                    } else {
                        if (Math.percentChance(50)) {
                            tiles.placeOnTile(Boss, tiles.getTileLocation(14, 7))
                        } else {
                            tiles.placeOnTile(Boss, tiles.getTileLocation(19, 6))
                        }
                    }
                    tiles.placeOnTile(SubBoss, Boss.tilemapLocation())
                    timer.after(350, function () {
                        animation.runImageAnimation(
                        Boss,
                        assets.animation`Boss8C`,
                        150,
                        true
                        )
                    })
                    timer.after(650, function () {
                        _8BossAttack(randint(1, 8), true)
                    })
                })
            } else if (Atk2 == 7) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8E7`, assets.animation`Boss8E7`, 100, false)
                for (let value of sprites.allOfKind(SpriteKind.BossEnemy)) {
                    if (sprites.readDataNumber(value, "KBResistence") == 1) {
                        animation.stopAnimation(animation.AnimationTypes.All, value)
                        animation.runImageAnimation(
                        value,
                        assets.animation`Boss8L7A`,
                        100,
                        false
                        )
                        pause(350)
                        tiles.placeOnTile(value, tiles.getTileLocation(mySprite.tilemapLocation().column, mySprite.tilemapLocation().row - 4))
                        pause(400)
                        sprites.setDataBoolean(value, "Fatal?", true)
                        value.vy = 400
                        pause(200)
                        pauseUntil(() => value.isHittingTile(CollisionDirection.Bottom))
                        animation.runImageAnimation(
                        value,
                        assets.animation`Boss8L7B`,
                        100,
                        false
                        )
                        value.vy = 0
                        timer.after(350, function () {
                            sprites.setDataBoolean(value, "Fatal?", false)
                            tiles.placeOnTile(value, tiles.getTileLocation(Boss.tilemapLocation().column - 3, Boss.tilemapLocation().row))
                            SpecifiedProj(value, 350, 13)
                        })
                    }
                }
                timer.after(800, function () {
                    _8BossAttack(randint(1, 8), true)
                })
            } else if (Atk2 == 8) {
                DuelrectionalAnim(SubBoss, assets.animation`Boss8EH`, assets.animation`Boss8EH`, 100, false)
                for (let value of sprites.allOfKind(SpriteKind.BossEnemy)) {
                    if (sprites.readDataNumber(value, "KBResistence") == 2) {
                        animation.stopAnimation(animation.AnimationTypes.All, value)
                        animation.runImageAnimation(
                        value,
                        assets.animation`Boss8RH`,
                        100,
                        false
                        )
                        pause(300)
                        tiles.placeOnTile(value, tiles.getTileLocation(mySprite.tilemapLocation().column, mySprite.tilemapLocation().row - 2))
                        for (let index = 0; index < 4; index++) {
                            pause(700)
                            for (let index = 0; index <= 2; index++) {
                                BossProjectile(12, true, true, 8000, assets.animation`SpireMagic`, image.create(15, 15), true)
                                EnemProj.setPosition(value.x - 6, value.y + 7)
                                if (index == 1) {
                                    ProjTrackII(EnemProj, mySprite.x, mySprite.y, 200)
                                } else {
                                    ProjTrackII(EnemProj, mySprite.x + randint(-25, 25), mySprite.y + randint(-25, 25), 175)
                                }
                            }
                        }
                        timer.after(400, function () {
                            tiles.placeOnTile(value, tiles.getTileLocation(Boss.tilemapLocation().column + 3, Boss.tilemapLocation().row))
                            SpecifiedProj(value, 400, 13)
                        })
                    }
                }
                timer.after(1200, function () {
                    _8BossAttack(randint(8, 8), true)
                })
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Runging, function (sprite, otherSprite) {
    if (controller.up.isPressed() && mySprite.ay == 500) {
        mySprite.setPosition(otherSprite.x, otherSprite.y)
        mySprite.y += 10
        mySprite.vy = 0
        if (mySprite.vx < 0) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`IsolHoldL`,
            300,
            true
            )
        } else {
            animation.runImageAnimation(
            mySprite,
            assets.animation`IsolHoldR`,
            300,
            true
            )
        }
        mySprite.vx = 0
        mySprite.ay = 0
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        pauseUntil(() => !(controller.up.isPressed()) || !(mySprite.tileKindAt(TileDirection.Top, assets.tile`BackBrick27`)))
        pauseUntil(() => controller.up.isPressed() || !(mySprite.tileKindAt(TileDirection.Top, assets.tile`BackBrick27`)))
        sprites.setDataBoolean(mySprite, "CanMove?", true)
        mySprite.ay = 499
        if (sprites.readDataNumber(mySprite, "FacingLeft?") == 0) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`IsolJumpRight`,
            200,
            true
            )
        } else {
            animation.runImageAnimation(
            mySprite,
            assets.animation`IsolJumpLeft`,
            200,
            true
            )
        }
        if (controller.up.isPressed()) {
            mySprite.vy = -225
            timer.after(100, function () {
                if (!(controller.up.isPressed())) {
                    mySprite.vy = -50
                } else {
                    timer.after(50, function () {
                        if (!(controller.up.isPressed())) {
                            mySprite.vy = -50
                        }
                    })
                }
            })
        }
        timer.after(500, function () {
            mySprite.ay = 500
        })
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.setDataNumber(mySprite, "FacingLeft?", 1)
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprites.readDataBoolean(sprite, "Fatal?")) {
        if (sprites.readDataNumber(sprite, "Ident") % 2 == 1 && !(sprites.readDataNumber(sprite, "Ident") == 13) || (sprites.readDataNumber(sprite, "Ident") == 10 || sprites.readDataNumber(sprite, "Ident") == 16)) {
            if (sprites.readDataNumber(sprite, "Attacking") == 0) {
                sprite.vx = sprites.readDataNumber(sprite, "Speed") * sprites.readDataNumber(sprite, "Direction")
                if (sprites.readDataNumber(sprite, "Ident") == 3) {
                    sprites.setDataNumber(sprite, "Direction", 0)
                    if (mySprite.x - sprite.x < 0) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy3L`,
                        500,
                        true
                        )
                    } else {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy3R`,
                        500,
                        true
                        )
                    }
                } else if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row + 1))) || sprite.isHittingTile(CollisionDirection.Left)) {
                    sprites.setDataNumber(sprite, "Direction", 1)
                    IdentAnim(sprite, 1, assets.animation`Enemy1R`, 150, true)
                    IdentAnim(sprite, 5, assets.animation`Enemy5R`, 110, true)
                    IdentAnim(sprite, 7, assets.animation`Enemy7R`, 200, true)
                    IdentAnim(sprite, 9, assets.animation`Enemy9R`, 150, true)
                    IdentAnim(sprite, 10, assets.animation`Enemy10R`, 300, true)
                    IdentAnim(sprite, 11, assets.animation`Enemy11R`, 250, true)
                    if (sprite.image.getPixel(8, 8) != 0) {
                        IdentAnim(sprite, 15, assets.animation`Enemy15R`, 125, true)
                    }
                    IdentAnim(sprite, 16, assets.animation`Enemy16R`, 100, true)
                    IdentAnim(sprite, 17, assets.animation`Enemy18R`, 100, true)
                } else if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row + 1))) || sprite.isHittingTile(CollisionDirection.Right)) {
                    sprites.setDataNumber(sprite, "Direction", -1)
                    IdentAnim(sprite, 1, assets.animation`Enemy1L`, 150, true)
                    IdentAnim(sprite, 5, assets.animation`Enemy5L`, 110, true)
                    IdentAnim(sprite, 7, assets.animation`Enemy7L`, 200, true)
                    IdentAnim(sprite, 9, assets.animation`Enemy9L`, 150, true)
                    IdentAnim(sprite, 10, assets.animation`Enemy10L`, 300, true)
                    IdentAnim(sprite, 11, assets.animation`Enemy11L`, 250, true)
                    if (sprite.image.getPixel(8, 8) != 0) {
                        IdentAnim(sprite, 15, assets.animation`Enemy15L`, 125, true)
                    }
                    IdentAnim(sprite, 16, assets.animation`Enemy16L`, 100, true)
                    IdentAnim(sprite, 17, assets.animation`Enemy18L`, 100, true)
                }
                if (Math.abs(mySprite.x - sprite.x) <= 32 && Math.abs(mySprite.y - sprite.y) <= 16 || Math.abs(mySprite.x - sprite.x) <= 48 && Math.abs(mySprite.y - sprite.y) <= 32 && (sprites.readDataNumber(sprite, "Ident") == 10 || sprites.readDataNumber(sprite, "Ident") == 11) || sprites.readDataBoolean(sprite, "Alert?")) {
                    sprites.setDataBoolean(sprite, "Alert?", false)
                    if (mySprite.x - sprite.x > 0) {
                        sprites.setDataNumber(sprite, "Direction", 1)
                        IdentAnim(sprite, 1, assets.animation`Enemy1AR`, 100, false)
                        IdentAnim(sprite, 3, assets.animation`Enemy1AR`, 100, false)
                        IdentAnim(sprite, 5, assets.animation`Enemy5AR`, 100, false)
                        IdentAnim(sprite, 7, assets.animation`Enemy7AR`, 100, false)
                        IdentAnim(sprite, 9, assets.animation`Enemy9AR`, 100, false)
                        IdentAnim(sprite, 10, assets.animation`Enemy10AR`, 100, false)
                        IdentAnim(sprite, 11, assets.animation`Enemy11AR`, 100, false)
                        if (sprite.image.getPixel(8, 8) == 0) {
                            IdentAnim(sprite, 15, assets.animation`Enemy15SAR`, 100, false)
                        } else {
                            IdentAnim(sprite, 15, assets.animation`Enemy15AR`, 100, false)
                        }
                        IdentAnim(sprite, 16, assets.animation`Enemy16AR`, 100, false)
                        IdentAnim(sprite, 17, assets.animation`Enemy17AR`, 100, false)
                    } else {
                        sprites.setDataNumber(sprite, "Direction", -1)
                        IdentAnim(sprite, 1, assets.animation`Enemy1AL`, 100, false)
                        IdentAnim(sprite, 3, assets.animation`Enemy1AL`, 100, false)
                        IdentAnim(sprite, 5, assets.animation`Enemy5AL`, 100, false)
                        IdentAnim(sprite, 7, assets.animation`Enemy7AL`, 100, false)
                        IdentAnim(sprite, 9, assets.animation`Enemy9AL`, 100, false)
                        IdentAnim(sprite, 10, assets.animation`Enemy10AL`, 100, false)
                        IdentAnim(sprite, 11, assets.animation`Enemy11AL`, 100, false)
                        if (sprite.image.getPixel(8, 8) == 0) {
                            IdentAnim(sprite, 15, assets.animation`Enemy15SAL`, 100, false)
                        } else {
                            IdentAnim(sprite, 15, assets.animation`Enemy15AL`, 100, false)
                        }
                        IdentAnim(sprite, 16, assets.animation`Enemy16AL`, 100, false)
                        IdentAnim(sprite, 17, assets.animation`Enemy17AL`, 100, false)
                    }
                    sprites.setDataNumber(sprite, "Attacking", 1)
                    sprite.vx = 0
                    timer.after(250, function () {
                        sprite.vx = sprites.readDataNumber(sprite, "Speed") * sprites.readDataNumber(sprite, "Direction") * 4
                        if (sprites.readDataNumber(sprite, "Ident") == 7) {
                            if (mySprite.isHittingTile(CollisionDirection.Bottom)) {
                                EnemProj = sprites.create(assets.image`PlantDanger`, SpriteKind.DethProj)
                                EnemyProjectiles(sprite, 0, 8, false)
                                EnemProj.lifespan = 1000
                                SpecifiedProj(EnemProj, 500, 3)
                                tiles.placeOnTile(EnemProj, mySprite.tilemapLocation())
                                animation.runImageAnimation(
                                EnemProj,
                                assets.animation`PlantDangerer`,
                                100,
                                false
                                )
                            }
                        } else if (sprites.readDataNumber(sprite, "Ident") == 9) {
                            sprite.vx = sprites.readDataNumber(sprite, "Speed") * sprites.readDataNumber(sprite, "Direction") * 6
                            EnemProj = sprites.create(image.create(16, 5), SpriteKind.DethProj)
                            EnemyProjectiles(sprite, 0, 12, true)
                            if (sprites.readDataNumber(sprite, "Direction") == 1) {
                                animation.runImageAnimation(
                                EnemProj,
                                assets.animation`SpearR`,
                                100,
                                false
                                )
                            } else {
                                animation.runImageAnimation(
                                EnemProj,
                                assets.animation`SpearL`,
                                100,
                                false
                                )
                            }
                            EnemProj.vx = 175 * sprites.readDataNumber(sprite, "Direction")
                            EnemProj.y += 2
                            EnemProj.lifespan = 300
                        } else if (sprites.readDataNumber(sprite, "Ident") == 10) {
                            sprite.vx = 0
                            EnemProj = sprites.create(image.create(15, 15), SpriteKind.DethProj)
                            animation.runImageAnimation(
                            EnemProj,
                            assets.animation`Magic`,
                            70,
                            true
                            )
                            EnemyProjectiles(sprite, 0, 8, true)
                            EnemProj.vy = -100
                            EnemProj.ay = 200
                            EnemProj.x += sprites.readDataNumber(sprite, "Direction") * 4
                            SpecifiedProj(EnemProj, 560, 5)
                        } else if (sprites.readDataNumber(sprite, "Ident") == 11) {
                            sprite.vx = 0
                            if (mySprite.isHittingTile(CollisionDirection.Bottom)) {
                                EnemProj = sprites.create(assets.image`PlantDanger`, SpriteKind.DethProj)
                                EnemyProjectiles(sprite, 0, 8, false)
                                EnemProj.lifespan = 1000
                                SpecifiedProj(EnemProj, 500, 3)
                                tiles.placeOnTile(EnemProj, mySprite.tilemapLocation())
                                animation.runImageAnimation(
                                EnemProj,
                                assets.animation`IceDangerer`,
                                100,
                                false
                                )
                            } else {
                                EnemProj = sprites.create(image.create(15, 15), SpriteKind.DethProj)
                                animation.runImageAnimation(
                                EnemProj,
                                assets.animation`Magic`,
                                70,
                                true
                                )
                                EnemyProjectiles(sprite, 0, 10, true)
                                EnemProj.vy = -90
                                EnemProj.ay = 200
                                EnemProj.x += sprites.readDataNumber(sprite, "Direction") * 4
                                SpecifiedProj(EnemProj, 560, 5)
                            }
                        } else if (sprites.readDataNumber(sprite, "Ident") == 15) {
                            sprite.vx = sprites.readDataNumber(sprite, "Direction") * 120
                            sprites.setDataNumber(sprite, "Speed", 30)
                        } else if (sprites.readDataNumber(sprite, "Ident") == 16) {
                            sprite.vx = 0
                            timer.after(150, function () {
                                if (sprites.readDataNumber(sprite, "HP") > 0) {
                                    EnemProj = sprites.create(image.create(8, 8), SpriteKind.DethProj)
                                    animation.runImageAnimation(
                                    EnemProj,
                                    assets.animation`Fire0`,
                                    100,
                                    true
                                    )
                                    EnemyProjectiles(sprite, 140, 8, true)
                                }
                            })
                        } else if (sprites.readDataNumber(sprite, "Ident") == 17) {
                            EnemProj = sprites.create(image.create(15, 15), SpriteKind.DethProj)
                            animation.runImageAnimation(
                            EnemProj,
                            assets.animation`SpireMark`,
                            100,
                            false
                            )
                            SpecifiedProj(EnemProj, 500, 3)
                            EnemyProjectiles(sprite, 0, 12, false)
                            EnemProj.setPosition(mySprite.x, mySprite.y)
                        } else {
                        	
                        }
                    })
                    timer.after(500, function () {
                        if (sprites.readDataNumber(sprite, "Ident") == 7 || (sprites.readDataNumber(sprite, "Ident") == 10 || (sprites.readDataNumber(sprite, "Ident") == 11 || sprites.readDataNumber(sprite, "Ident") == 16))) {
                            sprite.vx = 0
                            timer.after(500, function () {
                                sprites.setDataNumber(sprite, "Attacking", 0)
                            })
                        } else {
                            sprites.setDataNumber(sprite, "Attacking", 0)
                        }
                    })
                }
            }
        } else if (sprites.readDataNumber(sprite, "Ident") == 4 || sprites.readDataNumber(sprite, "Ident") == 13) {
            if (sprites.readDataNumber(sprite, "Attacking") == 0) {
                if (mySprite.x - sprite.x < 0 && sprite.image.getPixel(4, 15) != 0) {
                    IdentAnim(sprite, 4, assets.animation`Enemy4L`, 300, true)
                    IdentAnim(sprite, 13, assets.animation`Enemy13L`, 300, true)
                } else if (mySprite.x - sprite.x > 0 && sprite.image.getPixel(4, 15) != 15) {
                    IdentAnim(sprite, 4, assets.animation`Enemy4R`, 300, true)
                    IdentAnim(sprite, 13, assets.animation`Enemy13R`, 300, true)
                }
                if (Math.abs(mySprite.x - sprite.x) <= 64 && Math.abs(mySprite.y - sprite.y) <= 24 && sprites.readDataNumber(sprite, "Ident") == 4 || Math.abs(mySprite.x - sprite.x) <= 96 && Math.abs(mySprite.y - sprite.y) <= 24 && sprites.readDataNumber(sprite, "Ident") == 13 || sprites.readDataBoolean(sprite, "Alert?")) {
                    sprites.setDataBoolean(sprite, "Alert?", false)
                    sprites.setDataNumber(sprite, "Attacking", 1)
                    if (sprites.readDataNumber(sprite, "Ident") == 13 && Math.abs(mySprite.x - sprite.x) >= 80) {
                        Decoration = sprites.create(image.create(7, 7), SpriteKind.FollowDecorX)
                        Decoration.setFlag(SpriteFlag.Ghost, true)
                        if (mySprite.x - sprite.x <= -80) {
                            sprites.setDataNumber(Decoration, "Ident", 75)
                        } else {
                            sprites.setDataNumber(Decoration, "Ident", -75)
                        }
                        Decoration.y = sprite.y
                        Decoration.lifespan = 600
                        Decoration.z = 501
                        animation.runImageAnimation(
                        Decoration,
                        assets.animation`Warn`,
                        100,
                        false
                        )
                    }
                    if (mySprite.x - sprite.x < 0) {
                        IdentAnim(sprite, 4, assets.animation`Enemy4AL`, 100, false)
                        IdentAnim(sprite, 13, assets.animation`Enemy13AL`, 100, false)
                    } else {
                        IdentAnim(sprite, 4, assets.animation`Enemy4AR`, 100, false)
                        IdentAnim(sprite, 13, assets.animation`Enemy13AR`, 100, false)
                    }
                    timer.after(356 + sprites.readDataNumber(sprite, "Ident") * 11, function () {
                        if (sprites.readDataNumber(sprite, "HP") > 0) {
                            if (mySprite.x - sprite.x < 0) {
                                EnemProj = sprites.create(assets.image`ArrowL`, SpriteKind.DethProj)
                            } else {
                                EnemProj = sprites.create(assets.image`ArrowR`, SpriteKind.DethProj)
                            }
                            if (sprites.readDataNumber(sprite, "Ident") == 4) {
                                EnemyProjectiles(sprite, 200, 8, true)
                            } else {
                                EnemyProjectiles(sprite, 300, 10, true)
                            }
                            EnemProj.ay = 100
                            EnemProj.vy += -20
                        }
                    })
                    timer.after(912 + sprites.readDataNumber(sprite, "Ident") * 22, function () {
                        sprites.setDataNumber(sprite, "Attacking", 0)
                    })
                }
            }
        } else {
        	
        }
    } else {
        if (sprites.readDataBoolean(sprite, "Invincible?")) {
            sprites.setDataBoolean(sprite, "Invincible?", false)
            timer.after(600, function () {
                sprites.setDataBoolean(sprite, "Fatal?", true)
            })
            if (sprites.readDataNumber(sprite, "Ident") == 1 || sprites.readDataNumber(sprite, "Ident") == 3) {
            	
            }
        }
    }
})
function ShopSummon (Shop: tiles.TileMapData[]) {
    tiles.setCurrentTilemap(Shop[0])
    ShopBooth = sprites.create(assets.image`ShoppingBooth`, SpriteKind.Shopper)
    tiles.placeOnRandomTile(ShopBooth, assets.tile`myTile17`)
    tiles.setTileAt(ShopBooth.tilemapLocation(), assets.tile`BackBrick1`)
    timer.after(500, function () {
        Flood.vy = 0
    })
    for (let index = 0; index <= 4; index++) {
        ShopItem = sprites.create(assets.image`ShopSlot`, SpriteKind.Sale)
        ShopItem.setPosition(ShopBooth.x - 44 + index * 22, ShopBooth.y - 24)
        sprites.setDataNumber(ShopItem, "Speed", 0)
        sprites.setDataNumber(ShopItem, "Type", randint(1, 3))
        if (sprites.readDataNumber(ShopItem, "Type") == 1) {
            sprites.setDataNumber(ShopItem, "Ident", randint(4, 24))
            sprites.setDataNumber(ShopItem, "Rarity", randint(5, 9))
            sprites.setDataNumber(ShopItem, "Money", Math.round(randint(16, 24) * sprites.readDataNumber(ShopItem, "Rarity") * ListEffects[11] * (2 / 3 + (ListStorage[2] - 1) * (1 / 6))))
            ShopItem.image.drawTransparentImage(ListWeapons[sprites.readDataNumber(ShopItem, "Ident") - 1], 2, 2)
        } else if (sprites.readDataNumber(ShopItem, "Type") == 2) {
            sprites.setDataNumber(ShopItem, "Ident", randint(1, 16))
            sprites.setDataNumber(ShopItem, "Rarity", randint(5, 9))
            sprites.setDataNumber(ShopItem, "Money", Math.round(randint(16, 24) * sprites.readDataNumber(ShopItem, "Rarity") * ListEffects[11] * (2 / 3 + (ListStorage[2] - 1) * (1 / 6))))
            ShopItem.image.drawTransparentImage(ListItems[sprites.readDataNumber(ShopItem, "Ident") - 1], 2, 2)
        } else if (sprites.readDataNumber(ShopItem, "Type") == 3) {
            sprites.setDataNumber(ShopItem, "Money", Math.round(randint(50, 75) * ListEffects[11] * (2 / 3 + (ListStorage[2] - 1) * (1 / 6))))
            sprites.setDataNumber(ShopItem, "Ident", randint(1, 2))
            ShopItem.image.drawTransparentImage([assets.image`WeaponChest`, assets.image`ItemChest`][sprites.readDataNumber(ShopItem, "Ident") - 1], 2, 2)
        } else {
        	
        }
    }
}
browserEvents.F.onEvent(browserEvents.KeyEvent.Pressed, function () {
    if (sprites.readDataBoolean(mySprite, "MetaAct?") && (sprites.readDataBoolean(mySprite, "CanMove?") && ListStorage[20] == 0) && ListStorage[0] == 0) {
        ListStorage[20] = 1
        mySprite.vx = 0
        sprites.setDataNumber(CameraSpr, "Ident", 5)
        DuraText.setFlag(SpriteFlag.Invisible, true)
        Cursor.setFlag(SpriteFlag.Invisible, false)
        Simplified(3, 1, 1)
    } else if (ListStorage[20] >= 1) {
        Simplified(4, 1, 1)
    }
})
function Texter (Icon: Image, Ident: number, X: number, Y: number, Left: boolean) {
    if (Ident == 5) {
        textSprite = textsprite.create("" + convertToText(Math.floor(ListStorage[Ident] / 60)) + ":" + convertToText(ListStorage[Ident] % 60), 0, 1)
    } else if (Ident == 6) {
        textSprite = textsprite.create("" + convertToText(Math.round(ListStorage[7] / ListStorage[6] * 100)) + "%", 0, 1)
    } else {
        textSprite = textsprite.create(convertToText(ListStorage[Ident]), 0, 1)
    }
    textSprite.setIcon(Icon)
    textSprite.setPosition(X, Y)
    textSprite.setKind(SpriteKind.Decor)
    if (Left) {
        textSprite.left = X
    } else {
        textSprite.right = X
    }
    if (ListStorage[18] == 1 && Ident == 18) {
        sprites.destroy(textSprite)
    }
}
function ModShuffle (Length: number, Pool: number) {
    ListMod = []
    for (let index = 0; index < Length - 2; index++) {
        ListMod.push(0)
    }
    ListMod.push(-13)
    for (let index = 0; index <= ListMod.length - 2; index++) {
        while (ListMod[ListMod.length - 1] == -13) {
            ListStorage[9] = randint(2, Pool)
            for (let value of ListMod) {
                if (ListStorage[9] == value) {
                    break;
                }
                if (value == -13) {
                    ListMod[index] = ListStorage[9]
                    ListMod[ListMod.length - 1] = -12
                }
            }
        }
        ListMod[ListMod.length - 1] = -13
    }
    ListMod[randint(1, ListMod.length - 3)] = -4
    if (ListStorage[2] == 8) {
        ListMod[ListMod.length - 1] = -2
    } else {
        ListMod[ListMod.length - 1] = randint(-3, -1)
    }
}
function Summoner (Ident: number, StartBlock: Image, EndBlock: Image, Integrity: number) {
    if (Math.percentChance(Integrity)) {
        for (let value of tiles.getTilesByType(StartBlock)) {
            if (Ident == 1) {
                Enemies(100, 50, 1, 5, Enemy1, randint(5, 8), assets.animation`Enemy1-3Spawn`, assets.image`EnemyTest`)
                EnemyGround(25, -1)
            } else if (Ident == 2) {
                Enemies(75, 75, 2, 8, Enemy1, randint(5, 8), assets.animation`Enemy2Spawn`, assets.image`Enemy2`)
            } else if (Ident == 3) {
                Enemies(100, 50, 3, 5, Enemy1, randint(5, 8), assets.animation`Enemy1-3Spawn`, assets.image`EnemyTest`)
                EnemyGround(25, 0)
            } else if (Ident == 4) {
                Enemies(80, 60, 4, 7, Enemy1, randint(6, 10), assets.animation`Enemy4Spawn`, assets.image`EnemyTest`)
                EnemyGround(0, 0)
            } else if (Ident == 5) {
                Enemies(120, 40, 5, 8 * ListEffects[1], Enemy1, randint(5, 8), assets.animation`Enemy5Spawn`, assets.image`EnemyTest`)
                EnemyGround(35, -1)
            } else if (Ident == 6) {
                Enemies(100, 100, 6, 9 * ListEffects[1], Enemy1, randint(6, 10), assets.animation`Enemy6Spawn`, assets.image`Enemy6`)
            } else if (Ident == 7) {
                Enemies(135, 50, 7, 7 * ListEffects[2], Enemy1, randint(5, 8), assets.animation`Enemy7Spawn`, assets.image`EnemyTest`)
                EnemyGround(15, -1)
            } else if (Ident == 8) {
                Enemies(60, 125, 8, 5 * ListEffects[2], Enemy1, randint(6, 10), assets.animation`Enemy8Spawn`, assets.image`Enemy8`)
            } else if (Ident == 9) {
                Enemies(160, 70, 9, 12, Enemy1, randint(12, 16), assets.animation`Enemy9Spawn`, assets.image`EnemyTest`)
                EnemyGround(20, -1)
            } else if (Ident == 10) {
                Enemies(75, 30, 10, 4, Enemy1, randint(6, 10), assets.animation`Enemy10Spawn`, assets.image`EnemyTest`)
                EnemyGround(10, -1)
            } else if (Ident == 11) {
                Enemies(125, 40, 11, 6 * ListEffects[3], Enemy1, randint(6, 10), assets.animation`Enemy11Spawn`, assets.image`EnemyTest`)
                EnemyGround(20, -1)
            } else if (Ident == 12) {
                Enemies(110, 40, 12, 10 * ListEffects[3], Enemy1, randint(6, 10), assets.animation`Enemy12Spawn`, assets.image`Enemy12`)
            } else if (Ident == 13) {
                Enemies(90, 120, 13, 5 * ListEffects[4], Enemy1, randint(5, 8), assets.animation`Enemy13Spawn`, assets.image`EnemyTest`)
                EnemyGround(0, 0)
            } else if (Ident == 14) {
                Enemies(80, 80, 14, 8 * ListEffects[4], Enemy1, randint(6, 10), assets.animation`Enemy14Spawn`, assets.image`Enemy14`)
            } else if (Ident == 15) {
                Enemies(110, 50, 15, 10, Enemy1, randint(5, 8), assets.animation`Enemy15Spawn`, assets.image`EnemyTest`)
                EnemyGround(0, 0)
            } else if (Ident == 16) {
                Enemies(150, 80, 16, 6, Enemy1, randint(6, 10), assets.animation`Enemy16Spawn`, assets.image`EnemyTest`)
                EnemyGround(5, -1)
            } else if (Ident == 17) {
                Enemies(200, 120, 17, 12, Enemy1, randint(14, 20), assets.animation`Enemy17Spawn`, assets.image`EnemyTest`)
                EnemyGround(25, -1)
            } else if (Ident == 18) {
                Enemies(150, 160, 18, 8, Enemy1, randint(14, 20), assets.animation`Enemy18Spawn`, assets.image`Enemy18`)
            }
            tiles.placeOnTile(Enemy1, value)
            if (value.column <= 30 && value.row >= 150 && (ListStorage[2] == 8 && ListMod[ListStorage[1] - 2] == -2)) {
                sprites.setDataBoolean(Enemy1, "Mark", true)
                ListStorage[8] = ListStorage[8] + 1
            }
            if (!(tiles.tileAtLocationEquals(tiles.getTileLocation(value.column, value.row - 1), assets.tile`transparency16`))) {
                tiles.setTileAt(value, EndBlock)
            } else {
                if (!(EndBlock == assets.tile`myTile5`)) {
                    tiles.setTileAt(value, assets.tile`transparency16`)
                }
            }
        }
    }
}
function _1BossAttack (Atk2: number) {
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (Atk2 == 1) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1A`,
            100,
            false
            )
            for (let index = 0; index <= 4; index++) {
                EnemProj = sprites.create(assets.image`Rock`, SpriteKind.DethProj)
                EnemProj.setPosition(Boss.x + randint(-24, 24), Boss.y + randint(-10, 10))
                EnemProj.ay = 50
                EnemProj.vy = -50
                EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                sprites.setDataNumber(EnemProj, "Damage", 9)
                animation.runImageAnimation(
                EnemProj,
                [assets.animation`Rock1`, assets.animation`Rock2`, assets.animation`Rock3`]._pickRandom(),
                100,
                false
                )
                SpecifiedProj(EnemProj, 500, 1)
                pause(randint(100, 500))
            }
            timer.after(500, function () {
                if (sprites.readDataNumber(Boss, "HP") <= 500) {
                    _1BossAttack(randint(1, 6))
                } else {
                    _1BossAttack(randint(1, 4))
                }
            })
        } else if (Atk2 == 2) {
            if (Boss.tilemapLocation().column == 10 || Boss.tilemapLocation().column == 15 && Math.percentChance(50)) {
                Simplified(1, 1, 1)
            } else {
                Simplified(1, -1, 1)
            }
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1B`,
            150,
            true
            )
            timer.after(3600, function () {
                animation.stopAnimation(animation.AnimationTypes.All, Boss)
                if (sprites.readDataNumber(Boss, "HP") <= 500) {
                    if (Math.percentChance(20)) {
                        _1BossAttack(1)
                    } else {
                        _1BossAttack(randint(3, 6))
                    }
                } else {
                    if (Math.percentChance(33)) {
                        _1BossAttack(1)
                    } else {
                        _1BossAttack(randint(3, 4))
                    }
                }
            })
        } else if (Atk2 == 3) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1C`,
            100,
            false
            )
            Enemies(75, 75, 2, 8, Enemy1, randint(5, 8), assets.animation`Enemy2Spawn`, assets.image`Enemy2`)
            tiles.placeOnTile(Enemy1, tiles.getTileLocation(randint(9, 21), randint(10, 14)))
            timer.after(1500, function () {
                if (sprites.readDataNumber(Boss, "HP") <= 500) {
                    _1BossAttack(randint(1, 6))
                } else {
                    _1BossAttack(randint(1, 4))
                }
            })
        } else if (Atk2 == 4) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1D`,
            100,
            false
            )
            timer.after(750, function () {
                BossProjectile(18, true, true, 600, assets.animation`Boss1Bolt`, image.create(65, 65), false)
                EnemProj.setPosition(Boss.x, Boss.y)
            })
            timer.after(1500, function () {
                if (sprites.readDataNumber(Boss, "HP") <= 500) {
                    _1BossAttack(randint(1, 6))
                } else {
                    _1BossAttack(randint(1, 4))
                }
            })
        } else if (Atk2 == 5) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1E`,
            100,
            false
            )
            timer.after(700, function () {
                for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
                    BossProjectile(12, true, true, 500, assets.animation`SmallBolt`, image.create(43, 43), false)
                    tiles.placeOnTile(EnemProj, value.tilemapLocation())
                    sprites.destroy(value)
                }
            })
            timer.after(1500, function () {
                _1BossAttack(randint(1, 6))
            })
        } else if (Atk2 == 6) {
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss1F`,
            100,
            false
            )
            timer.after(500, function () {
                for (let index = 0; index < 20; index++) {
                    if (sprites.readDataNumber(Boss, "HP") <= 0) {
                        break;
                    }
                    BossProjectile(7, true, false, 10000, assets.animation`BossBolt2`, image.create(8, 8), true)
                    EnemProj.setPosition(Boss.x, Boss.y)
                    EnemProj.setVelocity(randint(-96, 96), randint(-200, 0))
                    EnemProj.ay = 300
                    EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                    pause(100)
                }
            })
            timer.after(2500, function () {
                _1BossAttack(randint(1, 6))
            })
        }
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.BossEnemy, function (sprite, otherSprite) {
    if (sprites.readDataNumber(otherSprite, "HP") > 0) {
        ProjHit(sprite, otherSprite)
    }
})
browserEvents.E.onEvent(browserEvents.KeyEvent.Pressed, function () {
    if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponASlot")) {
        sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponBSlot"))
        DuraText.setText("" + sprites.readDataNumber(Weapon, "WeaponBDura") + "/" + ListDurability[sprites.readDataNumber(mySprite, "Weapon")])
    } else if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponBSlot")) {
        sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponASlot"))
        DuraText.setText("" + sprites.readDataNumber(Weapon, "WeaponADura") + "/" + ListDurability[sprites.readDataNumber(mySprite, "Weapon")])
    }
    if (sprites.readDataNumber(mySprite, "Weapon") <= 3) {
        DuraText.setText("--/--")
    }
    DuraText.setFlag(SpriteFlag.Invisible, false)
    WeaponHoldImgs(ListWeapons, "Weapon", Weapon, mySprite)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.setDataNumber(mySprite, "FacingLeft?", 0)
})
scene.onOverlapTile(SpriteKind.Enemy, assets.tile`myTile13`, function (sprite, location) {
    sprites.setDataNumber(sprite, "Money", 0)
    EnemyDeath(sprite)
    ListStorage[4] = ListStorage[4] - 1
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Deth, function (sprite, otherSprite) {
    if (ListStorage[20] >= 1) {
        Simplified(4, 1, 1)
    }
    while (mySprite.y > Flood.top) {
        sprites.changeDataNumberBy(mySprite, "HP", -1)
        if (sprites.readDataNumber(mySprite, "HP") <= 0 || mySprite.y > Flood.y) {
            sprites.setDataNumber(mySprite, "HP", 100)
            Flood.setImage(assets.image`DethFlood`)
            Death("Drown")
        }
        pause(50)
    }
})
function ItemEffects (Sprite2: Sprite, Ident: number, _: number) {
    if (sprites.readDataNumber(Sprite2, "Ident") == Ident) {
        ListEffects[sprites.readDataNumber(Sprite2, "Ident") - 1] = _
        PlateTitle(ListNamePlates[1][sprites.readDataNumber(Sprite2, "Ident") - 1])
        if (sprites.readDataNumber(Sprite2, "Ident") == 6) {
            sprites.setDataNumber(mySprite, "HP", 125)
        } else if (sprites.readDataNumber(Sprite2, "Ident") == 11) {
            if (sprites.readDataNumber(mySprite, "Weapon") == sprites.readDataNumber(mySprite, "WeaponASlot")) {
                sprites.setDataNumber(Weapon, "WeaponADura", ListDurability[sprites.readDataNumber(Weapon, "Ident")])
            } else {
                sprites.setDataNumber(Weapon, "WeaponBDura", ListDurability[sprites.readDataNumber(Weapon, "Ident")])
            }
        } else if (sprites.readDataNumber(Sprite2, "Ident") == 14) {
            ListMod[ListMod.length - 1] = -1
        } else if (sprites.readDataNumber(Sprite2, "Ident") == 15) {
            ListMod[ListMod.length - 1] = -2
        } else if (sprites.readDataNumber(Sprite2, "Ident") == 16) {
            ListMod[ListMod.length - 1] = -3
        } else {
        	
        }
    }
}
function _5BossAttack (Atk2: number, BossIdent: Sprite) {
    if (sprites.readDataNumber(BossIdent, "HP") > 0) {
        if (sprites.readDataNumber(BossIdent, "FacingLeft?") == 1 && mySprite.x - BossIdent.x > 0) {
            sprites.setDataNumber(BossIdent, "FacingLeft?", 0)
            animation.runImageAnimation(
            BossIdent,
            assets.animation`Boss5R`,
            100,
            false
            )
            pause(200)
        } else if (sprites.readDataNumber(BossIdent, "FacingLeft?") == 0 && mySprite.x - BossIdent.x < 0) {
            sprites.setDataNumber(BossIdent, "FacingLeft?", 1)
            animation.runImageAnimation(
            BossIdent,
            assets.animation`Boss5L`,
            100,
            false
            )
            pause(200)
        }
        if (Math.percentChance(20)) {
            if (sprites.readDataNumber(BossIdent, "Damage") == 15) {
                DuelrectionalAnim(BossIdent, assets.animation`Boss5ELA`, assets.animation`Boss5ERA`, 100, false)
                timer.after(500, function () {
                    DuelrectionalAnim(BossIdent, assets.animation`Boss5ELB`, assets.animation`Boss5ERB`, 100, true)
                    for (let index = 0; index <= 7; index++) {
                        if (sprites.readDataNumber(BossIdent, "HP") > 0) {
                            BossProjectile(9, false, false, 2900, assets.animation`Magic`, image.create(15, 15), true)
                            EnemProj.setPosition(BossIdent.x, BossIdent.y - 18)
                            SpecifiedProj(EnemProj, 100, 9)
                            EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                            pause(400)
                        }
                    }
                    if (sprites.readDataNumber(BossIdent, "HP") > 0) {
                        animation.stopAnimation(animation.AnimationTypes.All, BossIdent)
                        DuelrectionalAnim(BossIdent, assets.animation`Boss5ELC`, assets.animation`Boss5ERC`, 100, false)
                        timer.after(500, function () {
                            _5BossAttack(randint(1, 4), BossIdent)
                        })
                    }
                })
            } else {
                DuelrectionalAnim(BossIdent, assets.animation`Boss5IL`, assets.animation`Boss5IR`, 200, true)
                timer.after(randint(500, 2000), function () {
                    if (sprites.readDataNumber(BossIdent, "HP") > 0) {
                        animation.stopAnimation(animation.AnimationTypes.All, BossIdent)
                        _5BossAttack(randint(1, 4), BossIdent)
                    }
                })
            }
        } else {
            if (Atk2 == 1) {
                if (sprites.readDataNumber(BossIdent, "Ident") == 1) {
                    DuelrectionalAnim(BossIdent, assets.animation`Boss5AAL`, assets.animation`Boss5AAR`, 100, false)
                } else {
                    DuelrectionalAnim(BossIdent, assets.animation`Boss5BAL`, assets.animation`Boss5BAR`, 100, false)
                }
                timer.after(500, function () {
                    sprites.setDataBoolean(BossIdent, "Fatal?", false)
                    if (Math.percentChance(50)) {
                        if (Math.percentChance(50)) {
                            tiles.placeOnTile(BossIdent, tiles.getTileLocation(7, 13))
                        } else {
                            tiles.placeOnTile(BossIdent, tiles.getTileLocation(11, 15))
                        }
                    } else {
                        if (Math.percentChance(50)) {
                            tiles.placeOnTile(BossIdent, tiles.getTileLocation(17, 15))
                        } else {
                            tiles.placeOnTile(BossIdent, tiles.getTileLocation(21, 13))
                        }
                    }
                    if (sprites.readDataNumber(BossIdent, "Ident") == 1) {
                        BossIdent.x += 6
                    } else {
                        BossIdent.x += -6
                    }
                    timer.after(500, function () {
                        _5BossAttack(randint(2, 4), BossIdent)
                        sprites.setDataBoolean(BossIdent, "Fatal?", true)
                    })
                })
            } else if (Atk2 == 2) {
                DuelrectionalAnim(BossIdent, assets.animation`Boss5BL`, assets.animation`Boss5BR`, 100, false)
                timer.after(300, function () {
                    for (let index = 0; index <= 6; index++) {
                        BossProjectile(8, false, false, 1700, assets.animation`Magic`, image.create(15, 15), true)
                        if (sprites.readDataNumber(BossIdent, "FacingLeft?") == 1) {
                            EnemProj.setPosition(BossIdent.x - 10 + index * 3.3, BossIdent.y - 10)
                            ProjTrackII(EnemProj, BossIdent.x - 30 + index * 10, BossIdent.y - 30, 100)
                        } else {
                            EnemProj.setPosition(BossIdent.x + 10 - index * 3.3, BossIdent.y - 10)
                            ProjTrackII(EnemProj, BossIdent.x + 30 - index * 10, BossIdent.y - 30, 100)
                        }
                        SpecifiedProj(EnemProj, 500, 9)
                        EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
                        EnemProj.fx = 150
                        EnemProj.fy = 150
                        pause(50)
                    }
                    timer.after(1000, function () {
                        _5BossAttack(randint(1, 4), BossIdent)
                    })
                })
            } else if (Atk2 == 3) {
                DuelrectionalAnim(BossIdent, assets.animation`Boss5CL`, assets.animation`Boss5CR`, 100, false)
                BossProjectile(13, false, true, 3000, assets.animation`Icicle`, image.create(16, 80), false)
                tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(9, 19), 15))
                SpecifiedProj(EnemProj, 500, 3)
                timer.after(1200, function () {
                    _5BossAttack(randint(1, 4), BossIdent)
                })
            } else if (Atk2 == 4) {
                DuelrectionalAnim(BossIdent, assets.animation`Boss5DL`, assets.animation`Boss5DR`, 100, false)
                timer.after(400, function () {
                    for (let index = 0; index <= 2; index++) {
                        BossProjectile(12, true, true, 4000, assets.animation`Mines`, image.create(16, 16), true)
                        EnemProj.setPosition(BossIdent.x, BossIdent.y)
                        EnemProj.setVelocity(randint(-40, 40), randint(150, 200))
                        EnemProj.ay = -300
                        pause(200)
                        if (sprites.readDataNumber(BossIdent, "Ident") == 2 && index == 1) {
                            break;
                        }
                    }
                    timer.after(1500, function () {
                        _5BossAttack(randint(1, 4), BossIdent)
                    })
                })
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.DethProj, function (sprite, otherSprite) {
    Hit(otherSprite)
})
function _3BossAttack (Atk2: number) {
    if (sprites.readDataNumber(Boss, "HP") > 0) {
        if (sprites.readDataNumber(Boss, "FacingLeft?") == 1 && mySprite.x - Boss.x > 0) {
            sprites.setDataNumber(Boss, "FacingLeft?", 0)
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss3R`,
            100,
            false
            )
            pause(400)
        } else if (sprites.readDataNumber(Boss, "FacingLeft?") == 0 && mySprite.x - Boss.x < 0) {
            sprites.setDataNumber(Boss, "FacingLeft?", 1)
            animation.runImageAnimation(
            Boss,
            assets.animation`Boss3L`,
            100,
            false
            )
            pause(400)
        }
        if (sprites.readDataNumber(Boss, "HP") <= 800 && sprites.readDataNumber(Boss, "KBResistence") == 1000) {
            sprites.setDataNumber(Boss, "KBResistence", 999)
            color.setColor(7, color.parseColorString("#8d3434"), 2000)
            timer.after(2300, function () {
                color.setColor(6, color.parseColorString("#5d1414"), 2000)
            })
        }
        if (Atk2 == 1) {
            DirectionalAnim(assets.animation`Boss3AL`, assets.animation`Boss3AR`, 100, false)
            timer.after(850, function () {
                sprites.setDataBoolean(Boss, "Fatal?", false)
                Boss.x = randint(152, 296)
                sprites.setDataNumber(Boss, "FacingLeft?", sprites.readDataNumber(Boss, "FacingLeft?") * -1 + 1)
            })
            timer.after(1400, function () {
                sprites.setDataBoolean(Boss, "Fatal?", true)
                if (sprites.readDataNumber(Boss, "HP") > 800) {
                    _3BossAttack(randint(2, 5))
                } else {
                    _3BossAttack(randint(1, 6))
                }
            })
        } else if (Atk2 == 2) {
            DirectionalAnim(assets.animation`Boss3BL`, assets.animation`Boss3BR`, 100, false)
            timer.after(1000, function () {
                for (let index = 0; index < 9; index++) {
                    BossProjectile(12, false, true, 1000, assets.animation`PlantDangerer`, assets.image`PlantDanger`, false)
                    SpecifiedProj(EnemProj, 500, 3)
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(8, 20), 13))
                }
            })
            timer.after(1500, function () {
                if (sprites.readDataNumber(Boss, "HP") > 800) {
                    _3BossAttack(randint(1, 5))
                } else {
                    _3BossAttack(randint(1, 6))
                }
            })
        } else if (Atk2 == 3) {
            DirectionalAnim(assets.animation`Boss3CL`, assets.animation`Boss3CR`, 100, false)
            timer.after(500, function () {
                BossProjectile(18, true, true, 600, assets.animation`Boss3BoltA`, image.create(65, 65), false)
                EnemProj.setPosition(Boss.x, Boss.y)
            })
            timer.after(1200, function () {
                if (sprites.readDataNumber(Boss, "HP") > 800) {
                    _3BossAttack(randint(1, 5))
                } else {
                    _3BossAttack(randint(1, 6))
                }
            })
        } else if (Atk2 == 4) {
            DirectionalAnim(assets.animation`Boss3DL`, assets.animation`Boss3DR`, 100, false)
            for (let index = 0; index <= 2; index++) {
                BossProjectile(14, false, true, 700, assets.animation`Boss3BoltB`, image.create(16, 16), false)
                tiles.placeOnTile(EnemProj, tiles.getTileLocation(randint(9, 19), 16))
                if (index == 1) {
                    tiles.placeOnTile(EnemProj, tiles.getTileLocation(14, 13))
                }
                EnemProj.vy = -200
                EnemProj.ay = 300
                SpecifiedProj(EnemProj, 600, 11)
                pause(400)
            }
            timer.after(1200, function () {
                if (sprites.readDataNumber(Boss, "HP") > 800) {
                    _3BossAttack(randint(1, 5))
                } else {
                    _3BossAttack(randint(1, 6))
                }
            })
        } else if (Atk2 == 5) {
            DirectionalAnim(assets.animation`Boss3EL`, assets.animation`Boss3ER`, 100, false)
            for (let index = 0; index <= 3; index++) {
                BossProjectile(14, false, true, 1000, assets.animation`Boss3BoltD`, image.create(16, 80), false)
                tiles.placeOnTile(EnemProj, tiles.getTileLocation(mySprite.tilemapLocation().column + randint(-2, 2), 13))
                SpecifiedProj(EnemProj, 500, 3)
                if (index == 2 && sprites.readDataNumber(Boss, "HP") > 800) {
                    break;
                }
                pause(500)
            }
            timer.after(400, function () {
                if (sprites.readDataNumber(Boss, "HP") > 800) {
                    _3BossAttack(randint(1, 5))
                } else {
                    _3BossAttack(randint(1, 6))
                }
            })
        } else if (Atk2 == 6) {
            DirectionalAnim(assets.animation`Boss3FL`, assets.animation`Boss3FR`, 100, false)
            timer.after(460, function () {
                Boss.ay = 500
                Boss.vy = -230
                Boss.vx = (mySprite.x - Boss.x) * 2
            })
            timer.after(900, function () {
                Boss.ay = 0
                Boss.vy = 0
                Boss.vx = 0
            })
            timer.after(1100, function () {
                Boss.vy = 600
                timer.after(200, function () {
                    for (let index = 0; index <= 2; index++) {
                        BossProjectile(14, false, true, 1000, assets.animation`Boss3BoltD`, image.create(16, 80), false)
                        tiles.placeOnTile(EnemProj, tiles.getTileLocation(mySprite.tilemapLocation().column + (index - 1), 13))
                        SpecifiedProj(EnemProj, 500, 3)
                    }
                })
            })
            timer.after(1700, function () {
                _3BossAttack(randint(1, 6))
            })
        }
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick8`, function (sprite, location) {
    if (browserEvents.MouseLeft.isPressed()) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        tiles.setTileAt(location, assets.tile`myTile3`)
        ListStorage[7] = ListStorage[7] + 1
        ListStorage[3] = ListStorage[3] + 1
        DroppedItem = sprites.create(assets.image`Weapon1`, SpriteKind.Drop)
        sprites.setDataNumber(DroppedItem, "Type", 1)
        tiles.placeOnTile(DroppedItem, location)
        ItemFly(DroppedItem)
        sprites.setDataNumber(DroppedItem, "Ident", randint(4, 24))
        WeaponHoldImgs(ListWeapons, "Ident", DroppedItem, DroppedItem)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick26`, function (sprite, location) {
    if (browserEvents.MouseLeft.isPressed()) {
        tiles.setTileAt(location, assets.tile`myTile7`)
        ListStorage[7] = ListStorage[7] + 1
        ListStorage[3] = ListStorage[3] + 1
        for (let index = 0; index < randint(20, 25); index++) {
            Coin = sprites.create(assets.image`Opal`, SpriteKind.Un$$$)
            tiles.placeOnTile(Coin, location)
            Coin.setVelocity(randint(-100, 100), randint(-200, 100))
            Coin.ay = 500
            Coin.setBounceOnWall(true)
        }
    }
})
function Death (Cause: string) {
    if (sprites.readDataNumber(mySprite, "HP") < 1000) {
        if (ListMod[ListStorage[1] - 2] == -1) {
            if (ListStorage[2] == ListStorage[16]) {
                if (sprites.readDataNumber(Boss, "Rarity") == 998) {
                    sprites.setDataNumber(Boss, "Mana", 999)
                }
            } else if (ListStorage[2] == ListStorage[16] * -1 + 5) {
                if (Boss.vy != 0) {
                    sprites.setDataNumber(Boss, "Mana", 999)
                }
            }
        }
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
        sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
        blockSettings.remove("Save")
        Weapon.setFlag(SpriteFlag.Invisible, true)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        sprites.setDataBoolean(mySprite, "CanDash?", false)
        sprites.setDataBoolean(mySprite, "Reloaded?", false)
        sprites.setDataBoolean(mySprite, "Alert?", true)
        mySprite.ay = 50
        sprites.setDataNumber(mySprite, "HP", 1000)
        Flood.vy = 1
        mySprite.fx = 10
        animation.stopAnimation(animation.AnimationTypes.All, mySprite)
        if (Cause != "Fall") {
            mySprite.setVelocity(20, -50)
        }
        mySprite.setImage(assets.image`IsolDead`)
        if (Cause == "Drown") {
            sprites.setDataString(mySprite, "Misc", "Drown")
            for (let index = 0; index <= 13; index++) {
                color.setColor(1 + index, color.rgb(0, 0, 80))
            }
        } else if (Cause == "EnemyB") {
            for (let index = 0; index <= 13; index++) {
                let list = 0
                color.setColor(1 + index, color.rgb(196, 0, list))
            }
        } else if (Cause == "Fall") {
            for (let index = 0; index <= 13; index++) {
                color.setColor(1 + index, color.rgb(16, 0, 64))
            }
        } else {
            for (let index = 0; index <= 13; index++) {
                color.setColor(1 + index, color.rgb(255, 255, 255))
            }
        }
        timer.after(50, function () {
            for (let value of tiles.getTilesByType(assets.tile`Brick1`)) {
                tiles.setTileAt(value, sprites.builtin.forestTiles10)
            }
            for (let value of tiles.getTilesByType(assets.tile`Floor1`)) {
                tiles.setTileAt(value, sprites.builtin.forestTiles10)
            }
            color.setColor(15, color.rgb(0, 0, 0))
            timer.after(1000, function () {
                color.FadeToBlack.startScreenEffect(1500)
                timer.after(2000, function () {
                    if (ListMod[ListStorage[1] - 2] == -1) {
                        sprites.setDataNumber(Boss, "HP", 0)
                        if (Math.percentChance(100)) {
                            tiles.setCurrentTilemap(tilemap`Epilogue`)
                            tiles.placeOnTile(mySprite, tiles.getTileLocation(0, 0))
                            tiles.placeOnTile(CameraSpr, tiles.getTileLocation(0, 0))
                            mySprite.vy = 0
                            mySprite.ay = 0
                            DuraText.setFlag(SpriteFlag.Invisible, true)
                            Weapon.setFlag(SpriteFlag.Invisible, true)
                            color.startFadeFromCurrent(color.originalPalette, 1000)
                            Cutscene = sprites.create(assets.image`Black`, SpriteKind.Decor)
                            DethMessage(1, ["One with the Spire.", "He Knows of your Existence.", "Destroyed."], ["", "", "No Evidence."], "Worthless Scraps of Weapons", "Get you Nowhere.", sprites.readDataNumber(mySprite, "WeaponASlot") == 1)
                            DethMessage(ListStorage[16], ["Become Memories.", "Purposeless Cretin.", "Deleted."], ["", "", ""], "ERROR-502", "\"Dead as He!!\"", sprites.readDataNumber(Boss, "Mana") == 999)
                            DethMessage(ListStorage[16] * -1 + 5, ["No more Frolicking.", "My Master will", "The Dark Ruins"], ["", "soon Return.", "hold many Secrets."], "Reduced to a Shape.", " ", sprites.readDataNumber(Boss, "Mana") == 999)
                            DethMessage(4, ["Bow Down to your Master!", "True Royalty subjects to", "Look Where you stand Now."], ["", "the King.", "You are no Royalty."], "So much Riches...", "...Yet you fall by my Hand.", ListEffects[12] >= 300)
                            DethMessage(ListStorage[17], ["No More. No Less.", "Frozen in your Tracks.", "Your remains will be"], ["", "", "Eternally Frozen in Time."], "United Comerades never", "Kneel to their Rival.", sprites.readDataNumber(mySprite, "WeaponASlot") == 18)
                            DethMessage(ListStorage[17] * -1 + 11, ["This World will be", "The Sea's Wrath", "Attempts to Pervade the "], ["Engulfed in Ocean.", "will Erode all.", "Depths are in Vain."], "Ink will drench that", "Powerless Tome you hold.", ListEffects[4] != 1)
                            DethMessage(7, ["He Abandoned us.", "...", "You were Never"], ["", "", "Seen from Again."], "I Refuse to Fall", "by my Own Magic.", ListEffects[5] != 1)
                            DethMessage(8, ["Your Fate was Sealed from", "All that Climbing...", "YOUR RETURN WAS FORETOLD."], ["the Moment you were Born.", "...Look where it Got You.", ""], "Your Worthless Magic", "will Always Fail You!", sprites.readDataNumber(mySprite, "Mana") <= 5)
                            timer.after(3500, function () {
                                color.FadeToBlack.startScreenEffect(1000)
                                timer.after(1000, function () {
                                    sprites.destroy(textSprite)
                                    sprites.destroy(textSprite2)
                                })
                            })
                            pause(5000)
                        }
                    }
                    Overview(false)
                    pauseUntil(() => browserEvents.MouseLeft.isPressed())
                    color.FadeToBlack.startScreenEffect(1500)
                    timer.after(1500, function () {
                        game.reset()
                    })
                })
            })
        })
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.SwingDoor, function (sprite, otherSprite) {
    if (mySprite.x - otherSprite.x < 0) {
        animation.runImageAnimation(
        otherSprite,
        assets.animation`SDoorRO`,
        100,
        false
        )
    } else {
        animation.runImageAnimation(
        otherSprite,
        assets.animation`SDoorLO`,
        100,
        false
        )
    }
    for (let index = 0; index <= 2; index++) {
        tiles.setWallAt(tiles.getTileLocation(otherSprite.tilemapLocation().column, otherSprite.tilemapLocation().row - 1 + index), false)
    }
    pauseUntil(() => !(mySprite.overlapsWith(otherSprite)))
    for (let index = 0; index <= 2; index++) {
        tiles.setWallAt(tiles.getTileLocation(otherSprite.tilemapLocation().column, otherSprite.tilemapLocation().row - 1 + index), true)
    }
    if (otherSprite.image.equals(assets.image`FullSwingR`)) {
        animation.runImageAnimation(
        otherSprite,
        assets.animation`SDoorRC`,
        100,
        false
        )
    } else if (otherSprite.image.equals(assets.image`FullSwingL`)) {
        animation.runImageAnimation(
        otherSprite,
        assets.animation`SDoorLC`,
        100,
        false
        )
    } else {
        animation.stopAnimation(animation.AnimationTypes.All, otherSprite)
        otherSprite.setImage(assets.image`Door`)
    }
})
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    if (!(image.getDimension(sprite.image, image.Dimension.Width) == 7 && image.getDimension(sprite.image, image.Dimension.Height) == 3)) {
        sprites.destroy(sprite)
    }
})
function EnemyProjectiles (sprite: Sprite, Speed: number, Damage: number, Fatal: boolean) {
    EnemProj.setPosition(sprite.x, sprite.y)
    EnemProj.setFlag(SpriteFlag.DestroyOnWall, true)
    if (Speed != 0) {
        ProjTrackII(EnemProj, mySprite.x, mySprite.y, Speed)
    }
    sprites.setDataBoolean(EnemProj, "Fatal?", Fatal)
    sprites.setDataNumber(EnemProj, "Damage", Damage)
}
function SpireConclude () {
    for (let value of sprites.allOfKind(SpriteKind.BossEnemy)) {
        if (sprites.readDataNumber(value, "KBResistence") >= 1) {
            animation.stopAnimation(animation.AnimationTypes.All, value)
            animation.runImageAnimation(
            value,
            [assets.animation`Boss8LPhase0`, assets.animation`Boss8RPhase`][sprites.readDataNumber(value, "KBResistence") - 1],
            100,
            false
            )
            value.lifespan = 350
        }
    }
    animation.stopAnimation(animation.AnimationTypes.All, Boss)
    animation.runImageAnimation(
    Boss,
    assets.animation`Boss8CDeath`,
    100,
    false
    )
    animation.runImageAnimation(
    SubBoss,
    assets.animation`Boss8EDeath`,
    100,
    false
    )
    Boss.lifespan = 3500
    SubBoss.lifespan = 3500
    sprites.setDataNumber(CameraSpr, "Ident", 3)
    sprites.destroy(CameraAnchor)
    sprites.setDataBoolean(mySprite, "MetaAct?", false)
    sprites.setDataBoolean(mySprite, "Invincible?", true)
    timer.after(3300, function () {
        color.FadeToWhite.startScreenEffect(200)
        timer.after(2500, function () {
            color.FadeToBlack.startScreenEffect(1500)
            timer.after(3000, function () {
                Overview(true)
                pauseUntil(() => browserEvents.MouseLeft.isPressed())
                ListStorage[15] = 9
                color.FadeToBlack.startScreenEffect(1000)
                timer.after(2500, function () {
                    ListStorage[18] = ListStorage[18] + 1
                    sprites.setDataNumber(CameraSpr, "Ident", 1)
                    sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
                    sprites.destroy(Module)
                    sprites.destroy(Epilogue)
                    mySprite.setFlag(SpriteFlag.Invisible, false)
                    Weapon.setFlag(SpriteFlag.Invisible, false)
                    mySprite.ay = 500
                    sprites.setDataBoolean(mySprite, "Invincible?", false)
                    sprites.setDataBoolean(mySprite, "MetaAct?", true)
                    sprites.setDataBoolean(mySprite, "Mark", false)
                    sprites.setDataNumber(mySprite, "HP", 100)
                    ListStorage[0] = 0
                    for (let index = 0; index <= 4; index++) {
                        ListStorage[3 + index] = 0
                    }
                    ListStorage[1] = 1
                    ListStorage[2] = 1
                    tiles.setCurrentTilemap(tilemap`TowerA1`)
                    EnemySpawn()
                    XChamberNum()
                    tiles.placeOnRandomTile(CameraSpr, assets.tile`BackBrick0`)
                    color.setPalette(
                    color.originalPalette
                    )
                })
            })
        })
    })
}
browserEvents.onMouseMove(function (x, y) {
    sprites.setDataNumber(Cursor, "X", x)
    sprites.setDataNumber(Cursor, "Y", y)
    if (ListStorage[20] >= 0 && Math.abs(x - 68) < 44) {
        for (let value of sprites.allOfKind(SpriteKind.Press)) {
            if (y >= 92) {
                value.vy = -64
            } else if (y <= 33) {
                value.vy = 64
            } else {
                value.vy = 0
            }
        }
    } else {
    	
    }
})
function SpirePeak (TileMaps: tiles.TileMapData[], AFlood: number, BWaves: number, CFlood: number) {
    tiles.setCurrentTilemap(TileMaps[(ListStorage[10] + 1) * -1])
    if (ListStorage[10] == -1) {
        ListStorage[8] = 1
        timer.after(500, function () {
            Flood.vy = AFlood * -1
        })
        if (ListStorage[2] == ListStorage[17]) {
            ListStorage[8] = 2
            timer.after(16000, function () {
                Flood.vy = 0
            })
        }
    } else if (ListStorage[10] == -2) {
        ListStorage[11] = BWaves
        sprites.setDataBoolean(mySprite, "Mark", true)
        timer.after(100, function () {
            Flood.top = scene.cameraProperty(CameraProperty.Bottom)
        })
        timer.after(700, function () {
            Flood.vy = 0
        })
        if (ListStorage[2] == 4) {
            Decoration = sprites.create(assets.image`KingThrone`, SpriteKind.Decor)
            tiles.placeOnTile(Decoration, tiles.getTileLocation(47, 21))
            Boss = sprites.create(assets.image`King`, SpriteKind.Enemy)
            tiles.placeOnTile(Boss, tiles.getTileLocation(47, 21))
            Boss.y += 6
        }
    } else if (ListStorage[10] == -3) {
        timer.after(500, function () {
            Flood.vy = CFlood * -1
            scene.cameraShake(4, 500)
            if (Math.percentChance(5)) {
                Decoration = sprites.create(assets.image`RUN`, SpriteKind.Decor)
                Decoration.z = 1000
                Decoration.setPosition(mySprite.x, mySprite.y)
                timer.after(200, function () {
                    sprites.destroy(Decoration)
                })
            }
            timer.after(1000, function () {
                scene.cameraShake(2, 200)
                timer.after(2300, function () {
                    scene.cameraShake(3, 500)
                })
            })
        })
    }
}
function ItemFly (Sprite2: Sprite) {
    Sprite2.vy = -100
    Sprite2.ay = 200
    Sprite2.vx = randint(-40, 40)
    Sprite2.fx = 30
}
function SectorSaver (Var: number, Color: boolean) {
    if (Var == ListStorage[16]) {
        tiles.setCurrentTilemap(tilemap`TowerB1`)
        ModShuffle(9, 9)
    } else if (Var == ListStorage[16] * -1 + 5) {
        tiles.setCurrentTilemap(tilemap`TowerC1`)
        ModShuffle(11, 12)
    } else if (Var == 4) {
        tiles.setCurrentTilemap(tilemap`TowerD1`)
        ModShuffle(9, 9)
    } else if (Var == ListStorage[17]) {
        tiles.setCurrentTilemap(tilemap`TowerE1`)
        ModShuffle(9, 9)
    } else if (Var == ListStorage[17] * -1 + 11) {
        tiles.setCurrentTilemap(tilemap`TowerF1`)
        ModShuffle(7, 7)
    } else if (Var == 7) {
        tiles.setCurrentTilemap(tilemap`TowerG1`)
        ModShuffle(9, 9)
    } else if (Var == 8) {
        tiles.setCurrentTilemap(tilemap`TowerH1`)
        ModShuffle(10, 10)
    } else if (Var == 1) {
        tiles.setCurrentTilemap(tilemap`TowerA1`)
        ModShuffle(6, 7)
    }
    if (Color) {
        if (ListStorage[2] == ListStorage[16]) {
            color.setColor(13, color.parseColorString("#885353"))
            color.setColor(12, color.parseColorString("#6c4040"))
            color.setColor(14, color.parseColorString("#472a2a"))
            color.setColor(10, color.parseColorString("#a1654f"))
            color.setColor(11, color.parseColorString("#60301f"))
        } else if (ListStorage[2] == ListStorage[16] * -1 + 5) {
            color.setColor(13, color.parseColorString("#356835"))
            color.setColor(12, color.parseColorString("#2a472a"))
            color.setColor(14, color.parseColorString("#152315"))
        } else if (ListStorage[2] == 4) {
            color.setColor(3, color.parseColorString("#981111"))
        } else if (ListStorage[2] == ListStorage[17]) {
            color.setColor(13, color.parseColorString("#538888"))
            color.setColor(12, color.parseColorString("#406c6c"))
            color.setColor(14, color.parseColorString("#2a4747"))
            color.setColor(10, color.parseColorString("#70471f"))
            color.setColor(11, color.parseColorString("#4d3216"))
        } else if (ListStorage[2] == ListStorage[17] * -1 + 11) {
            color.setColor(13, color.parseColorString("#535388"))
            color.setColor(12, color.parseColorString("#40406c"))
            color.setColor(14, color.parseColorString("#2a2a47"))
        } else if (ListStorage[2] == 7) {
            color.setColor(13, color.parseColorString("#5c406c"))
            color.setColor(12, color.parseColorString("#3b2a47"))
            color.setColor(14, color.parseColorString("#251b2d"))
            scroller.setLayerImage(scroller.BackgroundLayer.Layer3, assets.image`Dark`)
        } else if (ListStorage[2] == 8) {
            color.setColor(3, color.parseColorString("#00dd84"))
            color.setColor(13, color.parseColorString("#4c4c6c"))
            color.setColor(12, color.parseColorString("#3c3c56"))
            color.setColor(14, color.parseColorString("#262636"))
            if (mySprite.tileKindAt(TileDirection.Top, assets.tile`BackBrick31`)) {
                scroller.setLayerImage(scroller.BackgroundLayer.Layer3, assets.image`Dark`)
            }
        }
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick11`, function (sprite, location) {
    for (let value of tiles.getTilesByType(assets.tile`BackBrick11`)) {
        tiles.setTileAt(value, assets.tile`BackBrick1`)
    }
    for (let value of tiles.getTilesByType(assets.tile`Floor2`)) {
        tiles.setTileAt(value, assets.tile`Floor3`)
        tiles.setWallAt(value, true)
    }
    for (let value of tiles.getTilesByType(assets.tile`BackBrick10`)) {
        tiles.setTileAt(value, assets.tile`BackBrick12`)
        tiles.setWallAt(value, true)
    }
    if (ListMod[ListStorage[1] - 2] == -2) {
    	
    } else if (ListMod[ListStorage[1] - 2] == -1) {
        if (ListStorage[2] == 1) {
            Boss = sprites.create(assets.image`Boss1`, SpriteKind.BossEnemy)
            BossSpawning(1000, 15, 1000, 30, assets.animation`Boss1Spawn`, tiles.getTileLocation(15, 13))
            timer.after(2000, function () {
                sprites.setDataBoolean(Boss, "Fatal?", true)
                sprites.setDataNumber(Boss, "HP", 1000)
                PlateTitle(assets.image`PlateB1`)
                _1BossAttack(1)
            })
        } else if (ListStorage[2] == ListStorage[16]) {
            Decoration = sprites.create(assets.image`Wires`, SpriteKind.Decor)
            Decoration.setFlag(SpriteFlag.Ghost, true)
            Decoration.y += -1
            tiles.placeOnTile(Decoration, tiles.getTileLocation(20, 9))
            Boss = sprites.create(assets.image`Boss2`, SpriteKind.BossEnemy)
            BossSpawning(1500, 18, 1000, 50, assets.animation`Happy`, tiles.getTileLocation(20, 13))
        } else if (ListStorage[2] == ListStorage[16] * -1 + 5) {
            Boss = sprites.create(assets.image`Boss3`, SpriteKind.BossEnemy)
            BossSpawning(1500, 18, 1000, 40, assets.animation`Boss3Spawn`, tiles.getTileLocation(14, 13))
            timer.after(1150, function () {
                BossProjectile(18, true, true, 600, assets.animation`Boss3BoltA`, image.create(65, 65), false)
                EnemProj.setPosition(Boss.x, Boss.y)
            })
            timer.after(2000, function () {
                sprites.setDataNumber(Boss, "FacingLeft?", 0)
                sprites.setDataBoolean(Boss, "Fatal?", true)
                sprites.setDataNumber(Boss, "HP", 1600)
                PlateTitle(assets.image`PlateB3`)
                _3BossAttack(2)
            })
        } else if (ListStorage[2] == 4) {
            Decoration = sprites.create(assets.image`Staindow`, SpriteKind.Decor)
            tiles.placeOnTile(Decoration, tiles.getTileLocation(53, 19))
            Decoration = sprites.create(assets.image`KingThrone`, SpriteKind.Decor)
            tiles.placeOnTile(Decoration, tiles.getTileLocation(53, 21))
            Boss = sprites.create(image.create(48, 48), SpriteKind.BossEnemy)
            BossSpawning(1250, 14, 1000, 75, assets.animation`King-1`, tiles.getTileLocation(53, 21))
            Boss.y += 6
            sprites.setDataNumber(CameraSpr, "Ident", 2)
            CameraAnchor = sprites.create(assets.image`Camma`, SpriteKind.Decor)
            CameraAnchor.setFlag(SpriteFlag.GhostThroughWalls, true)
            CameraAnchor.setFlag(SpriteFlag.Invisible, true)
            timer.after(7100, function () {
                Boss.vy += -60
                Boss.ay += 400
                timer.after(350, function () {
                    animation.runImageAnimation(
                    Boss,
                    assets.animation`KingChallenge`,
                    100,
                    false
                    )
                    timer.after(4500, function () {
                        sprites.setDataBoolean(Boss, "Fatal?", true)
                        sprites.setDataNumber(Boss, "HP", 1250)
                        PlateTitle(assets.image`PlateB4`)
                        _4BossAttack(1)
                    })
                })
            })
        } else if (ListStorage[2] == ListStorage[17]) {
            Boss = sprites.create(assets.image`Boss5`, SpriteKind.BossEnemy)
            BossSpawning(1000, 12, 1000, 35, assets.animation`Boss5ASpawn`, tiles.getTileLocation(11, 15))
            SpecifiedProj(Boss, 2000, 8)
            sprites.setDataNumber(Boss, "Ident", 1)
            timer.after(800, function () {
                Boss = sprites.create(assets.image`Boss5`, SpriteKind.BossEnemy)
                BossSpawning(1000, 14, 1000, 25, assets.animation`Boss5BSpawn`, tiles.getTileLocation(17, 15))
                SpecifiedProj(Boss, 1200, 8)
                sprites.setDataNumber(Boss, "Ident", 2)
            })
        } else if (ListStorage[2] == ListStorage[17] * -1 + 11) {
        	
        } else if (ListStorage[2] == 7) {
            timer.after(4000, function () {
                Boss = sprites.create(assets.image`Boss7`, SpriteKind.BossEnemy)
                sprites.setDataBoolean(Boss, "Reloaded?", true)
                Boss.setFlag(SpriteFlag.GhostThroughWalls, true)
                sprites.setDataNumber(Boss, "X", -128)
                sprites.setDataNumber(Boss, "Y", -128)
                BossSpawning(750, 16, 300, 60, assets.animation`Boss7Spawn`, tiles.getTileLocation(0, 0))
                timer.after(200, function () {
                    Boss.z = 501
                    sprites.setDataBoolean(Boss, "Fatal?", true)
                    sprites.setDataNumber(Boss, "HP", 300)
                    timer.after(750, function () {
                        PlateTitle(assets.image`PlateB7`)
                    })
                    _7BossAttack(1)
                })
            })
        }
    } else {
        sprites.setDataBoolean(mySprite, "Mark", true)
        Summoner(1, assets.tile`BackBrick14`, assets.tile`BackBrick1`, 100)
        Summoner(2, assets.tile`BackBrick13`, assets.tile`BackBrick3`, 100)
        timer.after(500, function () {
            sprites.setDataBoolean(mySprite, "Mark", false)
        })
    }
})
function MenuClick (List: Image[], ListTT: string[], ListTB: string[], otherSprite: Sprite) {
    Button.image.drawTransparentImage(List[sprites.readDataNumber(otherSprite, "Ident") - 1], 4, 4)
    NamePlate.setFlag(SpriteFlag.Invisible, false)
    if (ListStorage[20] == 2 || sprites.readDataNumber(otherSprite, "HP") == 2) {
        NamePlate.setImage(ListNamePlates[0][sprites.readDataNumber(otherSprite, "Ident") - 1])
        textSprite3.setIcon(assets.image`DuraIcon`)
        textSprite3.setText(convertToText(ListDurability[sprites.readDataNumber(otherSprite, "Ident")]))
    } else if (ListStorage[20] == 3 || sprites.readDataNumber(otherSprite, "HP") == 3) {
        NamePlate.setImage(ListNamePlates[1][sprites.readDataNumber(otherSprite, "Ident") - 1])
        textSprite3.setIcon(assets.image`ChestIcon`)
        textSprite3.setText("--")
    } else if (ListStorage[20] == 4) {
        textSprite3.setIcon(assets.image`DamageIcon`)
        textSprite3.setText([
        "5",
        "8",
        "5",
        "7/8",
        "8",
        "10",
        "7/7",
        "5/8",
        "12",
        "4/8",
        "6/8",
        "10",
        "5/10",
        "8",
        "10",
        "6/8",
        "12/12",
        "8/10"
        ][sprites.readDataNumber(otherSprite, "Ident") - 1])
        NamePlate.setFlag(SpriteFlag.Invisible, true)
    } else {
    	
    }
    textSprite.setText(ListTT[sprites.readDataNumber(otherSprite, "Ident") - 1])
    textSprite2.setText(ListTB[sprites.readDataNumber(otherSprite, "Ident") - 1])
    textSprite.left = 26
    textSprite2.left = 26
    textSprite3.x = 136
}
function BossProjectile (Damage: number, Fatal: boolean, Ghost: boolean, Lifespan: number, Animation: any[], InitialImg: Image, Loop: boolean) {
    EnemProj = sprites.create(InitialImg, SpriteKind.DethProj)
    sprites.changeDataNumberBy(EnemProj, "Damage", Damage)
    sprites.setDataBoolean(EnemProj, "Fatal?", Fatal)
    EnemProj.setFlag(SpriteFlag.GhostThroughWalls, Ghost)
    EnemProj.lifespan = Lifespan
    animation.runImageAnimation(
    EnemProj,
    Animation,
    100,
    Loop
    )
}
sprites.onOverlap(SpriteKind.Curso, SpriteKind.Press, function (sprite, otherSprite) {
    if (browserEvents.MouseLeft.isPressed() && sprites.readDataNumber(otherSprite, "Ident") != 0) {
        Button.image.drawTransparentImage(assets.image`Display`, 0, 0)
        if (ListStorage[20] == 2 || sprites.readDataNumber(otherSprite, "HP") == 2) {
            MenuClick(ListWeapons, [
            "Damage: 25",
            "Damage: 12",
            "Damage: 20",
            "Damage: 50",
            "Damage: 8",
            "Damage: 35/25",
            "Damage: 20",
            "Healing: 7",
            "Damage: 40",
            "Damage: 15x5",
            "Damage: 30",
            "Damage: 30",
            "Damage: 75",
            "Damage: 45",
            "Damage: 35",
            "Damage: 20",
            "Damage: 25",
            "Damage: 20x2",
            "Damage: 60",
            "Damage: 40",
            "Damage: 24",
            "Damage: 12",
            "Damage: 8",
            "Damage: 50"
            ], [
            "Melee",
            "Ranged",
            "Mana Cost: 15",
            "Melee",
            "Ranged",
            "Melee/Ranged",
            "Ranged",
            "Mana Cost: 100",
            "Melee",
            "Ranged",
            "Melee",
            "Mana Cost: 12",
            "Ranged",
            "Mana Cost: 30",
            "Melee",
            "Ranged",
            "Mana Cost: 20",
            "Melee",
            "Ranged",
            "Melee",
            "Mana Cost: 15",
            "Ranged",
            "Mana Cost: 10",
            "Ranged"
            ], otherSprite)
        } else if (ListStorage[20] == 3 || sprites.readDataNumber(otherSprite, "HP") == 3) {
            MenuClick(ListItems, [
            "Heal All Hp when you",
            "Half Damage from",
            "Half Damage from",
            "Half Damage from",
            "Half Damage from",
            "Increase Max Hp",
            "+5 Damage",
            "x1.5 Damage",
            "Gain 3 Hp when you",
            "+25% Movement Speed",
            "Repair the Weapon",
            "Shop Prices Reduced",
            "Dash Through Enemies",
            "Creates a Red Crystal",
            "Creates a Green Crystal",
            "Creates a Blue Crystal"
            ], [
            "Ascend a Floor",
            "Fire-Based Enemies",
            "Plant-Based Enemies",
            "Ice-Based Enemies",
            "Water-Based Enemies",
            "To 125",
            "",
            "",
            "Kill an Enemy",
            "",
            "you are Holding",
            "by 20%",
            "to deal Damage",
            "on This final Floor",
            "on This final Floor",
            "on This final Floor"
            ], otherSprite)
        } else if (ListStorage[20] == 4) {
            MenuClick([
            assets.image`EnemyTest`,
            assets.image`Enemy2`,
            assets.image`Enemy3`,
            assets.image`Enemy4`,
            assets.image`Enemy5`,
            assets.image`Enemy6`,
            assets.image`Enemy7`,
            assets.image`Enemy8`,
            assets.image`Enemy9`,
            assets.image`Enemy10`,
            assets.image`Enemy11`,
            assets.image`Enemy12`,
            assets.image`Enemy13`,
            assets.image`Enemy14`,
            assets.image`Enemy15`,
            assets.image`Enemy16`,
            assets.image`Enemy17`,
            assets.image`Enemy18Inv`
            ], [
            "Hp: 100",
            "Hp: 75",
            "Hp: 100",
            "Hp: 80",
            "Hp: 120",
            "Hp: 100",
            "Hp: 135",
            "Hp: 60",
            "Hp: 160",
            "Hp: 75",
            "Hp: 125",
            "Hp: 110",
            "Hp: 90",
            "Hp: 80",
            "Hp: 110",
            "Hp: 150",
            "Hp: 200",
            "Hp: 150"
            ], [
            "Moves and Attacks",
            "Flies & Chases you",
            "Stays Instead of Walks",
            "Fires an Arrow",
            "Moves Quickly",
            "Chases you Quickly",
            "Summons Vines",
            "Fires Projectiles",
            "Tough with a Spear",
            "Uses Magic",
            "Uses Ice Magic",
            "Slow & Vigilant",
            "Snipes with Arrows",
            "Very Fast fliers",
            "Hidden until provoked",
            "Tanky with a Torch",
            "Very Tough & Dangerous",
            "Uses Spire Magic"
            ], otherSprite)
        } else {
        	
        }
        pauseUntil(() => !(browserEvents.MouseLeft.isPressed()))
    }
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (ListStorage[20] == 0) {
        if (ListStorage[0] == 0 && sprites.readDataBoolean(mySprite, "MetaAct?")) {
            if (sprites.readDataBoolean(mySprite, "Reloaded?")) {
                ListStorage[6] = ListStorage[6] + 1
                if (sprites.readDataNumber(mySprite, "Weapon") == 1) {
                    Atk(true, true, image.create(64, 64), true, 25, 30, 500, 600, true, 0, 0, x, y, assets.animation`StickR`, assets.animation`StickIR`, assets.animation`IsolMeleeRight`, assets.animation`StickL`, assets.animation`StickIL`, assets.animation`IsolMeleeLeft`, 0, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 2) {
                    Atk(false, false, assets.image`TestProj`, true, 12, 5, 1000, 300, false, 0, 5, x, y, assets.animation`NerfR`, assets.animation`BlasterR`, assets.animation`IsolShootRight`, assets.animation`NerfL`, assets.animation`BlasterL`, assets.animation`IsolShootLeft`, 0, false)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 125)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 3) {
                    Atk(false, false, image.create(8, 8), true, 20, 20, 2000, 500, false, -3, -3, x, y, assets.animation`MagicBolt`, assets.animation`StaffIR`, assets.animation`IsolShootRight`, assets.animation`MagicBolt`, assets.animation`StaffIL`, assets.animation`IsolShootLeft`, 15, true)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 175)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 4) {
                    Atk(true, true, image.create(80, 24), true, 50, 40, 500, 800, true, 0, 0, x, y, assets.animation`WhipR`, assets.animation`WhipIR`, assets.animation`IsolMelee2Right`, assets.animation`WhipL`, assets.animation`WhipIL`, assets.animation`IsolMelee2Left`, 0, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 5) {
                    Atk(false, false, assets.image`TestProj`, true, 8, 0, 1000, 10, false, 0, 5, x, y, assets.animation`LaserR`, assets.animation`LaserIR`, assets.animation`IsolShootRight`, assets.animation`LaserL`, assets.animation`LaserIL`, assets.animation`IsolShootLeft`, 5, false)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 150)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 6) {
                    if (Math.abs(x + scene.cameraProperty(CameraProperty.Left) - mySprite.x) <= 32 && Math.abs(y + scene.cameraProperty(CameraProperty.Top) - mySprite.y) <= 32) {
                        Atk(true, true, image.create(48, 16), true, 35, 25, 500, 700, true, 0, 0, x, y, assets.animation`BayonetMR`, assets.animation`BayonetRIR`, assets.animation`IsolShootRight`, assets.animation`BayonetML`, assets.animation`BayonetRIL`, assets.animation`IsolShootLeft`, 0, false)
                    } else {
                        Atk(false, false, assets.image`TestProj`, true, 25, 8, 1000, 1000, false, 0, 5, x, y, assets.animation`Bullet`, assets.animation`BayonetRIR`, assets.animation`IsolShootRight`, assets.animation`Bullet`, assets.animation`BayonetRIL`, assets.animation`IsolShootLeft`, 0, false)
                        ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 200)
                    }
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 7) {
                    Atk(false, false, assets.image`TestProj`, true, 20, 15, 1200, 600, false, 0, 0, x, y, assets.animation`Lobber`, assets.animation`LobberIR`, assets.animation`IsolMelee2Right`, assets.animation`Lobber`, assets.animation`LobberIL`, assets.animation`IsolMelee2Left`, 0, false)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 175)
                    Attack.ay = 300
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 8) {
                    Atk(false, false, image.create(16, 16), false, 0, 0, 300, 500, true, 0, 0, x, y, assets.animation`Heal`, assets.animation`ScepterIR`, assets.animation`IsolShootRight`, assets.animation`Heal`, assets.animation`ScepterIL`, assets.animation`IsolShootLeft`, 100, false)
                    sprites.changeDataNumberBy(mySprite, "HP", 7)
                    if (sprites.readDataNumber(mySprite, "HP") > 100 * ListEffects[5]) {
                        sprites.setDataNumber(mySprite, "HP", 100 * ListEffects[5])
                    }
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 9) {
                    Atk(true, true, image.create(64, 64), true, 40, 40, 700, 600, true, 0, 0, x, y, assets.animation`TorchR`, assets.animation`TorchIR`, assets.animation`IsolMeleeRight`, assets.animation`TorchL`, assets.animation`TorchIL`, assets.animation`IsolMeleeLeft`, 0, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 10) {
                    for (let index = 0; index < 5; index++) {
                        Atk(false, false, assets.image`TestProj`, true, 15, 12, 1000, 1100, false, 0, 3, x, y, assets.animation`Shotgun`, assets.animation`ShotgunIR`, assets.animation`IsolShootRight`, assets.animation`Shotgun`, assets.animation`ShotgunIL`, assets.animation`IsolShootLeft`, 0, false)
                        ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left) + randint(-20, 20), y + scene.cameraProperty(CameraProperty.Top) + randint(-20, 20), randint(150, 225))
                    }
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 11) {
                    Atk(true, true, image.create(32, 16), true, 30, 5, 300, 100, true, 0, 0, x, y, assets.animation`DaggerR`, assets.animation`DaggerIR`, assets.animation`IsolMeleeRight`, assets.animation`DaggerL`, assets.animation`DaggerIL`, assets.animation`IsolMeleeLeft`, 0, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 12) {
                    Atk(true, true, image.create(80, 80), true, 30, 0, 600, 600, true, 0, 0, x, y, assets.animation`SoulSwordR`, assets.animation`SoulSwordIR`, assets.animation`IsolMeleeRight`, assets.animation`SoulSwordL`, assets.animation`SoulSwordIL`, assets.animation`IsolMeleeLeft`, 12, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 13) {
                    Atk(false, false, image.create(56, 56), true, 75, 75, 3000, 3000, true, 0, -10, x, y, assets.animation`CinderR`, assets.animation`CinderIR`, assets.animation`IsolThrowRight`, assets.animation`CinderL`, assets.animation`CinderIL`, assets.animation`IsolThrowLeft`, 0, false)
                    Attack.setFlag(SpriteFlag.Invisible, true)
                    timer.after(800, function () {
                        Attack.setPosition(mySprite.x + (sprites.readDataNumber(mySprite, "FacingLeft?") * 2 - 1) * -10, mySprite.y - 10)
                        Attack.setFlag(SpriteFlag.Invisible, false)
                        Weapon.setFlag(SpriteFlag.Invisible, true)
                        ProjTrackII(Attack, Cursor.x, Cursor.y, 150)
                    })
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 14) {
                    Atk(true, true, image.create(65, 65), true, 45, 50, 600, 900, true, 0, 0, x, y, assets.animation`Pulse`, assets.animation`PulseIR`, assets.animation`IsolShootRight`, assets.animation`Pulse`, assets.animation`PulseIL`, assets.animation`IsolShootLeft`, 30, false)
                    timer.after(600, function () {
                        for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
                            sprites.setDataBoolean(value, "Melee?", false)
                        }
                        for (let value of sprites.allOfKind(SpriteKind.BossEnemy)) {
                            sprites.setDataBoolean(value, "Melee?", false)
                        }
                    })
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 15) {
                    Atk(true, true, image.create(80, 48), true, 35, 0, 500, 500, true, 0, 0, x, y, assets.animation`SwordR`, assets.animation`SwordIR`, assets.animation`IsolMeleeRight`, assets.animation`SwordL`, assets.animation`SwordIL`, assets.animation`IsolMeleeLeft`, 0, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 16) {
                    Atk(false, false, assets.image`TestProj`, true, 20, 25, 3000, 750, false, 0, -2, x, y, assets.animation`Lobster`, assets.animation`LobsterIR`, assets.animation`IsolMeleeRight`, assets.animation`Lobster`, assets.animation`LobsterIL`, assets.animation`IsolMeleeLeft`, 0, true)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 175)
                    Attack.ax = (x + scene.cameraProperty(CameraProperty.Left) - Attack.x) / Math.sqrt((x + scene.cameraProperty(CameraProperty.Left) - Attack.x) ** 2 + (y + scene.cameraProperty(CameraProperty.Top) - Attack.y) ** 2) * -300
                    Attack.ay = (y + scene.cameraProperty(CameraProperty.Top) - Attack.y) / Math.sqrt((x + scene.cameraProperty(CameraProperty.Left) - Attack.x) ** 2 + (y + scene.cameraProperty(CameraProperty.Top) - Attack.y) ** 2) * -300
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 17) {
                    Atk(true, false, image.create(48, 48), true, 25, 10, 4000, 800, true, 0, 0, x, y, assets.animation`Orbital`, assets.animation`OrbitalIR`, assets.animation`IsolShootRight`, assets.animation`Orbital`, assets.animation`OrbitalIL`, assets.animation`IsolShootLeft`, 20, true)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 75)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 18) {
                    Atk(true, true, image.create(80, 48), true, 20, 15, 800, 800, true, 0, 0, x, y, assets.animation`SickleR`, assets.animation`SickleIR`, assets.animation`IsolMeleeRight`, assets.animation`SickleL`, assets.animation`SickleIL`, assets.animation`IsolMeleeLeft`, 0, false)
                    timer.after(400, function () {
                        sprites.setDataBoolean(Attack, "Fatal?", true)
                    })
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 19) {
                    Atk(false, false, image.create(3, 3), true, 60, 35, 4000, 1200, false, 4, 0, x, y, assets.animation`Bullet`, assets.animation`51CalIR`, assets.animation`IsolMeleeRight`, assets.animation`Bullet`, assets.animation`51CalIL`, assets.animation`IsolMeleeLeft`, 0, false)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 500)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 20) {
                    Atk(true, true, image.create(112, 80), true, 40, 50, 800, 1400, true, 0, 0, x, y, assets.animation`ClaymoreR`, assets.animation`ClaymoreIR`, assets.animation`IsolMelee3Right`, assets.animation`ClaymoreL`, assets.animation`ClaymoreIL`, assets.animation`IsolMelee3Left`, 0, false)
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 21) {
                    Atk(false, false, image.create(11, 11), false, 24, 0, 4000, 425, true, 0, 0, x, y, assets.animation`Glyph`, assets.animation`TomeIR`, assets.animation`IsolShootRight`, assets.animation`Glyph`, assets.animation`TomeIL`, assets.animation`IsolShootLeft`, 15, false)
                    Attack.setPosition(x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top))
                    timer.after(400, function () {
                        sprites.setDataBoolean(Attack, "Fatal?", true)
                        ProjTrackII(Attack, Cursor.x, Cursor.y, 125)
                    })
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 22) {
                    Atk(true, false, image.create(8, 12), true, 12, 16, 1512, 512, false, 0, 0, x, y, assets.animation`Flag`, assets.animation`FlagIR`, assets.animation`IsolMelee2Right`, assets.animation`Flag`, assets.animation`FlagIL`, assets.animation`IsolMelee2Left`, 0, false)
                    Attack.follow(Cursor, 100)
                    timer.after(500, function () {
                        Attack.follow(Cursor, 0)
                        ProjTrackII(Attack, Cursor.x, Cursor.y, 100)
                    })
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 23) {
                    Atk(true, false, image.create(15, 15), true, 8, 0, 200, 25, true, 0, 0, x, y, assets.animation`Click`, assets.animation`MouseIR`, assets.animation`IsolShootRight`, assets.animation`Click`, assets.animation`MouseIL`, assets.animation`IsolShootLeft`, 10, false)
                    Attack.setPosition(x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top))
                } else if (sprites.readDataNumber(mySprite, "Weapon") == 24) {
                    Atk(true, false, image.create(7, 3), false, 50, 65, 20000, 1000, false, 0, 3, x, y, assets.animation`Mine`, assets.animation`MineIR`, assets.animation`IsolMelee2Right`, assets.animation`Mine`, assets.animation`MineIL`, assets.animation`IsolMelee2Left`, 0, false)
                    ProjTrackII(Attack, x + scene.cameraProperty(CameraProperty.Left), y + scene.cameraProperty(CameraProperty.Top), 125)
                    Attack.ay = 400
                    Attack.fx = 300
                    timer.after(900, function () {
                        sprites.setDataBoolean(Attack, "Fatal?", true)
                    })
                } else {
                	
                }
            }
        }
    } else {
        if (x <= 24) {
            if (y >= 93) {
                sprites.destroyAllSpritesOfKind(SpriteKind.Press)
                sprites.destroyAllSpritesOfKind(SpriteKind.PressStation)
                scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`Inventory4`)
                ListStorage[20] = 4
                Menuer(18, [
                assets.image`EnemyTest`,
                assets.image`Enemy2`,
                assets.image`Enemy3`,
                assets.image`Enemy4`,
                assets.image`Enemy5`,
                assets.image`Enemy6`,
                assets.image`Enemy7`,
                assets.image`Enemy8`,
                assets.image`Enemy9`,
                assets.image`Enemy10`,
                assets.image`Enemy11`,
                assets.image`Enemy12`,
                assets.image`Enemy13`,
                assets.image`Enemy14`,
                assets.image`Enemy15`,
                assets.image`Enemy16`,
                assets.image`Enemy17`,
                assets.image`Enemy18Inv`
                ])
            } else if (y >= 70) {
                sprites.destroyAllSpritesOfKind(SpriteKind.Press)
                sprites.destroyAllSpritesOfKind(SpriteKind.PressStation)
                scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`Inventory3`)
                ListStorage[20] = 3
                Menuer(16, ListItems)
            } else if (y >= 47) {
                sprites.destroyAllSpritesOfKind(SpriteKind.Press)
                sprites.destroyAllSpritesOfKind(SpriteKind.PressStation)
                scroller.setLayerImage(scroller.BackgroundLayer.Layer4, assets.image`Inventory2`)
                ListStorage[20] = 2
                Menuer(24, ListWeapons)
            } else if (y >= 24) {
                sprites.destroyAllSpritesOfKind(SpriteKind.Press)
                sprites.destroyAllSpritesOfKind(SpriteKind.PressStation)
                Simplified(3, 1, 1)
            }
            pauseUntil(() => !(browserEvents.MouseLeft.isPressed()))
        }
    }
})
function Menuer (MenuLen: number, List: Image[]) {
    if (ListStorage[20] != 1) {
        MoneyText.setPosition(2, 8)
        MoneyText.left = 2
        MoneyText.setFlag(SpriteFlag.Invisible, true)
    }
    NamePlate.setFlag(SpriteFlag.Invisible, true)
    textSprite = textsprite.create("--", 0, 1)
    textSprite.setFlag(SpriteFlag.Ghost, true)
    textSprite.setKind(SpriteKind.PressStation)
    textSprite.y = 107
    textSprite.setFlag(SpriteFlag.RelativeToCamera, true)
    sprites.setDataNumber(textSprite, "Ident", 0)
    textSprite.z = 996
    textSprite2 = textsprite.create("--", 0, 1)
    textSprite2.setFlag(SpriteFlag.Ghost, true)
    sprites.setDataNumber(textSprite2, "Ident", 0)
    textSprite2.y = 114
    textSprite2.setFlag(SpriteFlag.RelativeToCamera, true)
    textSprite2.setKind(SpriteKind.PressStation)
    textSprite2.z = 996
    textSprite3 = textsprite.create("--", 0, 1)
    textSprite3.setFlag(SpriteFlag.Ghost, true)
    textSprite3.setPosition(136, 72)
    textSprite3.setFlag(SpriteFlag.RelativeToCamera, true)
    textSprite3.setKind(SpriteKind.PressStation)
    textSprite3.z = 996
    for (let index = 0; index <= MenuLen - 1; index++) {
        if (ListStorage[20] != 4 || ListStorage[20] == 4 && (index <= 3 || index <= 7 && blockSettings.readNumber("MaxSector") >= 3 || (index <= 9 && blockSettings.readNumber("MaxSector") >= 4 || (index <= 13 && blockSettings.readNumber("MaxSector") >= 6 || (index <= 15 && blockSettings.readNumber("MaxSector") >= 7 || blockSettings.readNumber("MaxSector") >= 8))))) {
            Button = sprites.create(assets.image`MenuButton`, SpriteKind.Press)
            Button.setFlag(SpriteFlag.GhostThroughWalls, true)
            Button.z = 994
            sprites.setDataNumber(Button, "Ident", index + 1)
            Button.image.drawTransparentImage(List[index], 2, 2)
            SpecifiedProj(Button, 0, 15)
        }
    }
    Button = sprites.create(assets.image`Display`, SpriteKind.PressStation)
    Button.setFlag(SpriteFlag.GhostThroughWalls, true)
    Button.z = 995
    sprites.setDataNumber(Button, "Ident", 0)
    Button.setPosition(135, 47)
    Button.setFlag(SpriteFlag.RelativeToCamera, true)
}
function Hit (otherSprite: Sprite) {
    if (!(sprites.readDataBoolean(mySprite, "Invincible?")) && sprites.readDataBoolean(otherSprite, "Fatal?")) {
        sprites.setDataBoolean(mySprite, "Invincible?", true)
        sprites.changeDataNumberBy(mySprite, "HP", sprites.readDataNumber(otherSprite, "Damage") * -1)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        if (ListStorage[20] >= 1) {
            Simplified(4, 1, 1)
        }
        if (otherSprite.x - mySprite.x < 0) {
            mySprite.setVelocity(50, -150)
        } else {
            mySprite.setVelocity(-50, -150)
        }
        if (sprites.readDataNumber(mySprite, "HP") <= 0) {
            if (Math.percentChance(98)) {
                Death("Enemy")
            } else {
                Death("EnemyB")
            }
        } else {
            timer.after(500, function () {
                sprites.setDataBoolean(mySprite, "CanMove?", true)
                timer.after(250, function () {
                    sprites.setDataBoolean(mySprite, "Invincible?", false)
                })
            })
        }
    }
}
sprites.onCreated(SpriteKind.Enemy, function (sprite) {
    timer.after(600, function () {
        sprites.setDataBoolean(sprite, "Invincible?", false)
        sprites.setDataBoolean(sprite, "Fatal?", true)
        if (sprites.readDataNumber(sprite, "Ident") == 2 || (sprites.readDataNumber(sprite, "Ident") == 6 || (sprites.readDataNumber(sprite, "Ident") == 8 || (sprites.readDataNumber(sprite, "Ident") == 12 || (sprites.readDataNumber(sprite, "Ident") == 14 || sprites.readDataNumber(sprite, "Ident") == 18))))) {
            sprites.setDataBoolean(sprite, "Reloaded?", true)
            while (sprites.readDataNumber(sprite, "HP") > 0 && ListStorage[15] == 9) {
                if (Math.abs(mySprite.x - sprite.x) <= 40 && Math.abs(mySprite.y - sprite.y) <= 40 || Math.abs(mySprite.x - sprite.x) <= 64 && Math.abs(mySprite.y - sprite.y) <= 64 && sprites.readDataNumber(sprite, "Ident") == 12 || sprites.readDataBoolean(sprite, "Alert?")) {
                    if (sprite.image.equals(assets.image`Enemy2`)) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy2Chase`,
                        100,
                        true
                        )
                    } else if (sprite.image.equals(assets.image`Enemy6`)) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy6Chase`,
                        100,
                        true
                        )
                    } else if (sprite.image.equals(assets.image`Enemy8`) || sprite.image.equals(assets.image`Enemy8Shooting`)) {
                        sprite.setImage(assets.image`Enemy8Shooting`)
                        if (Math.abs(mySprite.x - sprite.x) <= 20 && Math.abs(mySprite.y - sprite.y) <= 20) {
                            animation.runImageAnimation(
                            sprite,
                            assets.animation`Enemy8Chase`,
                            100,
                            true
                            )
                        } else {
                            sprite.fx = 50
                            sprite.fy = 50
                        }
                    } else if (sprite.image.equals(assets.image`Enemy12`)) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy12Chase`,
                        100,
                        true
                        )
                    } else if (sprite.image.equals(assets.image`Enemy14`)) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy14Chase`,
                        100,
                        true
                        )
                    } else if (sprite.image.equals(assets.image`Enemy18`)) {
                        animation.runImageAnimation(
                        sprite,
                        assets.animation`Enemy18Chase`,
                        100,
                        true
                        )
                    } else {
                    	
                    }
                    if (Math.abs(mySprite.x - sprite.x) <= 48 && Math.abs(mySprite.y - sprite.y) <= 48) {
                        sprites.setDataBoolean(sprite, "Alert?", false)
                    }
                    sprite.fx = 0
                    sprite.fy = 0
                    if (sprites.readDataNumber(sprite, "Ident") == 2) {
                        ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 20)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 6) {
                        ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 25)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 8) {
                        if (Math.abs(mySprite.x - sprite.x) <= 20 && Math.abs(mySprite.y - sprite.y) <= 20) {
                            ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 20)
                        } else {
                            if (sprites.readDataBoolean(sprite, "Reloaded?")) {
                                sprites.setDataBoolean(sprite, "Reloaded?", false)
                                timer.after(500, function () {
                                    EnemProj = sprites.create(image.create(4, 4), SpriteKind.DethProj)
                                    animation.runImageAnimation(
                                    EnemProj,
                                    assets.animation`Enemy8Bolt`,
                                    75,
                                    true
                                    )
                                    EnemyProjectiles(sprite, 100, 12, true)
                                    timer.after(500, function () {
                                        sprites.setDataBoolean(sprite, "Alert?", false)
                                        sprites.setDataBoolean(sprite, "Reloaded?", true)
                                    })
                                })
                            }
                        }
                    } else if (sprites.readDataNumber(sprite, "Ident") == 12) {
                        ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 15)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 14) {
                        ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 30)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 18) {
                        ProjTrackII(sprite, mySprite.x, mySprite.y, (Math.abs(sprite.vx) + Math.abs(sprite.vy)) / 2 + 25)
                        if (sprites.readDataBoolean(sprite, "Reloaded?")) {
                            sprites.setDataBoolean(sprite, "Reloaded?", false)
                            timer.after(500, function () {
                                EnemProj = sprites.create(image.create(15, 15), SpriteKind.DethProj)
                                animation.runImageAnimation(
                                EnemProj,
                                assets.animation`SpireMagic`,
                                75,
                                true
                                )
                                EnemyProjectiles(sprite, 150, 14, true)
                                timer.after(250, function () {
                                    sprites.setDataBoolean(sprite, "Alert?", false)
                                    sprites.setDataBoolean(sprite, "Reloaded?", true)
                                })
                            })
                        }
                    } else {
                    	
                    }
                } else {
                    animation.stopAnimation(animation.AnimationTypes.All, sprite)
                    if (sprites.readDataNumber(sprite, "Ident") == 2) {
                        sprite.setImage(assets.image`Enemy2`)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 6) {
                        sprite.setImage(assets.image`Enemy6`)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 8) {
                        sprite.setImage(assets.image`Enemy8`)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 12) {
                        sprite.setImage(assets.image`Enemy12`)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 14) {
                        sprite.setImage(assets.image`Enemy14`)
                    } else if (sprites.readDataNumber(sprite, "Ident") == 18) {
                        sprite.setImage(assets.image`Enemy18`)
                    } else {
                    	
                    }
                    sprite.fx = 50
                    sprite.fy = 50
                }
                pause(200)
            }
        }
    })
})
sprites.onCreated(SpriteKind.Un$$$, function (sprite) {
    timer.after(400, function () {
        sprite.setKind(SpriteKind.$$$)
    })
    timer.after(randint(1500, 2000), function () {
        sprite.ay = 0
        sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
        sprite.follow(mySprite, 150)
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`BackBrick15`, function (sprite, location) {
    if (mySprite.vy > -80 && controller.up.isPressed()) {
        mySprite.vy += -15
    }
})
sprites.onOverlap(SpriteKind.Curso, SpriteKind.Sale, function (sprite, otherSprite) {
    if (browserEvents.MouseLeft.isPressed() && (ListStorage[12] >= sprites.readDataNumber(otherSprite, "Money") && sprites.readDataNumber(otherSprite, "Speed") != 1)) {
        ListStorage[12] = ListStorage[12] - sprites.readDataNumber(otherSprite, "Money")
        MoneyText.setText(convertToText(ListStorage[12]))
        sprites.setDataNumber(otherSprite, "Speed", 1)
        animation.runImageAnimation(
        otherSprite,
        assets.animation`Sold`,
        100,
        false
        )
        ShopBooth.image.setPixel(85, 61, 15)
        timer.after(2000, function () {
            ShopBooth.image.setPixel(85, 61, 13)
        })
        if (sprites.readDataNumber(otherSprite, "Type") == 1) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
            DroppedItem = sprites.create(assets.image`Weapon1`, SpriteKind.Drop)
            sprites.setDataNumber(DroppedItem, "Type", 1)
            ItemFly(DroppedItem)
            tiles.placeOnTile(DroppedItem, tiles.getTileLocation(ShopBooth.tilemapLocation().column + 2, ShopBooth.tilemapLocation().row + 1))
            sprites.setDataNumber(DroppedItem, "Ident", sprites.readDataNumber(otherSprite, "Ident"))
            WeaponHoldImgs(ListWeapons, "Ident", DroppedItem, DroppedItem)
            ListStorage[3] = ListStorage[3] + 1
        } else if (sprites.readDataNumber(otherSprite, "Type") == 2) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
            DroppedItem = sprites.create(assets.image`Weapon1`, SpriteKind.Drop)
            sprites.setDataNumber(DroppedItem, "Type", 2)
            ItemFly(DroppedItem)
            tiles.placeOnTile(DroppedItem, tiles.getTileLocation(ShopBooth.tilemapLocation().column + 2, ShopBooth.tilemapLocation().row + 1))
            sprites.setDataNumber(DroppedItem, "Ident", sprites.readDataNumber(otherSprite, "Ident"))
            WeaponHoldImgs(ListItems, "Ident", DroppedItem, DroppedItem)
            ListStorage[3] = ListStorage[3] + 1
        } else if (sprites.readDataNumber(otherSprite, "Type") == 3) {
            tiles.setTileAt(tiles.getTileLocation(ShopBooth.tilemapLocation().column + 4, ShopBooth.tilemapLocation().row + 2), [assets.tile`BackBrick8`, assets.tile`BackBrick78`][sprites.readDataNumber(otherSprite, "Ident") - 1])
        } else {
        	
        }
    }
    timer.after(50, function () {
        if (Math.abs(sprite.x - otherSprite.x) <= 6) {
            textSprite.setFlag(SpriteFlag.Invisible, false)
            textSprite.left = ShopBooth.left + 15
            textSprite.top = ShopBooth.top + 34
            textSprite.setText(convertToText(sprites.readDataNumber(otherSprite, "Money")))
            pauseUntil(() => !(sprite.overlapsWith(otherSprite)))
            textSprite.setFlag(SpriteFlag.Invisible, true)
        }
    })
})
function EnemyGround (Speed: number, Direction: number) {
    Enemy1.fx = 25
    Enemy1.ay = 500
    sprites.setDataNumber(Enemy1, "Speed", Speed)
    sprites.setDataNumber(Enemy1, "Direction", Direction)
}
function DuelrectionalAnim (BossIdent: Sprite, LAnim: any[], RAnim: any[], FPS: number, Loop: boolean) {
    if (mySprite.x - BossIdent.x < 0) {
        sprites.setDataNumber(BossIdent, "FacingLeft?", 1)
        animation.runImageAnimation(
        BossIdent,
        LAnim,
        FPS,
        Loop
        )
    } else {
        sprites.setDataNumber(BossIdent, "FacingLeft?", 0)
        animation.runImageAnimation(
        BossIdent,
        RAnim,
        FPS,
        Loop
        )
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprites.readDataBoolean(mySprite, "CanDash?") && (sprites.readDataBoolean(mySprite, "MetaAct?") && sprites.readDataBoolean(mySprite, "CanMove?"))) {
        sprites.setDataBoolean(mySprite, "CanDash?", false)
        sprites.setDataBoolean(mySprite, "CanMove?", false)
        for (let index = 0; index <= 4; index++) {
            mySprite.vx = 400 - sprites.readDataNumber(mySprite, "FacingLeft?") * 800 - index * (80 - sprites.readDataNumber(mySprite, "FacingLeft?") * 160)
            pause(50)
        }
        sprites.setDataBoolean(mySprite, "CanMove?", true)
        mySprite.vx = 0
        timer.after(700, function () {
            sprites.setDataBoolean(mySprite, "CanDash?", true)
        })
    }
})
function Overview (Alive: boolean) {
    ListStorage[0] = 1
    mySprite.setFlag(SpriteFlag.Invisible, true)
    HpBar.setFlag(SpriteFlag.Invisible, true)
    ManaBar.setFlag(SpriteFlag.Invisible, true)
    Weapon.setFlag(SpriteFlag.Invisible, true)
    DuraText.setFlag(SpriteFlag.Invisible, true)
    mySprite.ay = 0
    mySprite.vy = 0
    tiles.placeOnTile(mySprite, tiles.getTileLocation(0, 0))
    tiles.placeOnTile(CameraSpr, tiles.getTileLocation(0, 0))
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Shopper)
    sprites.destroyAllSpritesOfKind(SpriteKind.Sale)
    sprites.destroyAllSpritesOfKind(SpriteKind.BossEnemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Deth)
    sprites.destroyAllSpritesOfKind(SpriteKind.Drop)
    sprites.destroyAllSpritesOfKind(SpriteKind.Door)
    sprites.destroyAllSpritesOfKind(SpriteKind.SwingDoor)
    sprites.destroyAllSpritesOfKind(SpriteKind.Decor)
    sprites.destroyAllSpritesOfKind(SpriteKind.$$$)
    tiles.setCurrentTilemap(tilemap`Epilogue`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer3, assets.image`Light`)
    Epilogue = sprites.create(assets.image`Border`, SpriteKind.Decor)
    Epilogue.z = 1
    if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3) {
        Epilogue = sprites.create(assets.image`SpireEnd`, SpriteKind.Decor)
    } else {
        if (ListStorage[2] == 1) {
            if (ListStorage[1] == 1) {
                Epilogue = sprites.create(assets.image`Spire1`, SpriteKind.Decor)
            } else if (ListStorage[1] == 2) {
                Epilogue = sprites.create(assets.image`Spire2`, SpriteKind.Decor)
            } else if (ListStorage[1] == 3) {
                Epilogue = sprites.create(assets.image`Spire3`, SpriteKind.Decor)
            } else {
                Epilogue = sprites.create(assets.image`Spire4`, SpriteKind.Decor)
            }
        } else {
            if (ListStorage[1] == 1) {
                Epilogue = sprites.create(assets.image`SpireAir1`, SpriteKind.Decor)
            } else if (ListStorage[1] == 2) {
                Epilogue = sprites.create(assets.image`SpireAir2`, SpriteKind.Decor)
            } else if (ListStorage[1] == 3) {
                Epilogue = sprites.create(assets.image`SpireAir3`, SpriteKind.Decor)
            } else {
                Epilogue = sprites.create(assets.image`SpireAir4`, SpriteKind.Decor)
            }
        }
    }
    Epilogue.setFlag(SpriteFlag.GhostThroughWalls, true)
    if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3) {
        Module = sprites.create(assets.image`Peak`, SpriteKind.Decor)
    } else {
        Module = sprites.create(assets.image`Module`, SpriteKind.Decor)
    }
    color.startFadeFromCurrent(color.originalPalette, 200)
    timer.after(500, function () {
        if (Alive) {
            if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3) {
                if (ListStorage[2] == 8) {
                    textSprite = textsprite.create("Spire " + convertToText(ListStorage[18]) + " Destroyed", 0, 1)
                } else {
                    textSprite = textsprite.create("Sector " + convertToText(ListStorage[2]) + " Complete", 0, 1)
                }
            } else {
                textSprite = textsprite.create("Floor " + convertToText(ListStorage[1]) + " Complete", 0, 1)
            }
        } else {
            ListStorage[15] = 8
            ListStorage[9] = randint(1, 100)
            if (sprites.readDataString(mySprite, "Misc") == "Drown") {
                if (ListStorage[9] <= 90) {
                    DeathText("Drowned")
                } else {
                    DeathText("Washed Away")
                }
            } else if (sprites.readDataString(mySprite, "Misc") == "Fall") {
                if (ListStorage[9] <= 90) {
                    DeathText("Fell")
                } else {
                    DeathText("Tripped")
                }
            } else {
                if (ListStorage[9] <= 50) {
                    DeathText("Death")
                } else if (ListStorage[9] <= 70) {
                    DeathText("Slain")
                } else if (ListStorage[9] <= 85) {
                    DeathText("Deceased")
                } else if (ListStorage[9] <= 95) {
                    DeathText("Martyred")
                } else if (ListStorage[9] <= 99) {
                    DeathText("Bludgeoned")
                } else {
                    DeathText("Ganked")
                }
            }
        }
        textSprite.setKind(SpriteKind.Decor)
        textSprite.setPosition(80, 10)
        if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3 && Alive) {
            sprites.setDataNumber(mySprite, "HP", 100 * ListEffects[5])
            textSprite = textsprite.create("Floor " + convertToText(ListStorage[1]), 0, 14)
            ListSaves = [
            100,
            sprites.readDataNumber(mySprite, "WeaponASlot"),
            sprites.readDataNumber(Weapon, "WeaponADura"),
            sprites.readDataNumber(mySprite, "WeaponBSlot"),
            sprites.readDataNumber(Weapon, "WeaponBDura"),
            ListStorage[1],
            ListStorage[2],
            ListStorage[12],
            ListStorage[16],
            ListStorage[17],
            ListStorage[18],
            ListStorage[21],
            ListStorage[22]
            ]
            for (let index = 0; index <= 15; index++) {
                ListSaves.push(ListEffects[index])
            }
            if (ListStorage[2] == 8) {
                ListSaves[10] = ListStorage[18] + 1
                ListSaves[6] = 0
            }
            blockSettings.writeNumberArray("Save", ListSaves)
        } else {
            textSprite = textsprite.create("Sector " + convertToText(ListStorage[2]), 0, 14)
        }
        textSprite.setKind(SpriteKind.Decor)
        textSprite.setPosition(80, 20)
        if (ListMod[ListStorage[1] - 2] <= -1 && ListMod[ListStorage[1] - 2] >= -3) {
            if (Alive) {
                animation.runImageAnimation(
                Module,
                assets.animation`PeakCheck`,
                70,
                false
                )
            } else {
                animation.runImageAnimation(
                Module,
                assets.animation`PeakDeath`,
                70,
                false
                )
            }
        } else {
            if (Alive) {
                animation.runImageAnimation(
                Module,
                assets.animation`ModCheck`,
                70,
                false
                )
            } else {
                animation.runImageAnimation(
                Module,
                assets.animation`ModDeath`,
                70,
                false
                )
            }
        }
        Texter(assets.image`ChestIcon`, 3, 10, 40, true)
        Texter(assets.image`SkullIcon`, 4, 10, 60, true)
        Texter(assets.image`ClockIcon`, 5, 150, 40, false)
        Texter(assets.image`TargetIcon`, 6, 150, 60, false)
        Texter(assets.image`OpalIcon`, 12, 10, 80, true)
        Texter(assets.image`SpireIcon`, 18, 150, 80, false)
    })
}
sprites.onOverlap(SpriteKind.Deth, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.setDataNumber(otherSprite, "Money", 0)
    EnemyDeath(otherSprite)
    ListStorage[4] = ListStorage[4] - 1
})
scene.onOverlapTile(SpriteKind.Enemy, assets.tile`BackBrick64`, function (sprite, location) {
    sprites.setDataNumber(sprite, "Money", 0)
    EnemyDeath(sprite)
    ListStorage[4] = ListStorage[4] - 1
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    ProjHit(sprite, otherSprite)
})
function EnemySpawn () {
    Summoner(1, assets.tile`BackBrick6`, assets.tile`BackBrick1`, 100)
    Summoner(2, assets.tile`myTile2`, assets.tile`BackBrick1`, 100)
    Summoner(3, assets.tile`BackBrick9`, assets.tile`BackBrick1`, 100)
    Summoner(4, assets.tile`BackBrick19`, assets.tile`BackBrick1`, 100)
    Summoner(5, assets.tile`BackBrick24`, assets.tile`BackBrick1`, 100)
    Summoner(6, assets.tile`myTile6`, assets.tile`BackBrick1`, 100)
    Summoner(7, assets.tile`BackBrick32`, assets.tile`BackBrick1`, 100)
    Summoner(8, assets.tile`myTile8`, assets.tile`BackBrick1`, 100)
    Summoner(9, assets.tile`BackBrick47`, assets.tile`BackBrick46`, 100)
    Summoner(10, assets.tile`BackBrick48`, assets.tile`BackBrick46`, 100)
    Summoner(11, assets.tile`myTile9`, assets.tile`BackBrick1`, 100)
    Summoner(12, assets.tile`myTile14`, assets.tile`BackBrick1`, 100)
    Summoner(13, assets.tile`BackBrick66`, assets.tile`BackBrick1`, 100)
    Summoner(14, assets.tile`myTile15`, assets.tile`BackBrick1`, 100)
    Summoner(15, assets.tile`BackBrick70`, assets.tile`BackBrick1`, 100)
    Summoner(16, assets.tile`myTile10`, assets.tile`BackBrick1`, 100)
    Summoner(17, assets.tile`BackBrick71`, assets.tile`BackBrick1`, 100)
    Summoner(18, assets.tile`myTile16`, assets.tile`BackBrick1`, 100)
}
/**
 * 160x21
 * 
 * img`
 * 
 * .....................................................................................................11.....11...11111...1111...11..11..11......11111...11111...
 * 
 * .....................................................................................................111...111..111111..111111..11..11..11......111111..111111..
 * 
 * .....................................................................................................1111.1111..11......11..11..11..11..11......11..11..11..11..
 * 
 * .....................................................................................................111111111..111.....11..11..11..11..11......11..11..11..11..
 * 
 * .....................................................................................................11.111.11...111....11..11..11..11..11......111111..11..11..
 * 
 * ....1................................................................................................11..1..11....111...11..11..11..11..11......11111...11..11..
 * 
 * .....................................................................................................11.....11.....111..11..11..11..11..11......11......11..11..
 * 
 * .....................................................................................................11.....11......11..11..11..11..11..11......11......11..11..
 * 
 * .....................................................................................................11.....11..111111..111111..111111..111111..11......111111..
 * 
 * .....................................................................................................11.....11..11111....1111....1111...111111..11......11111...
 * 
 * ................................................................................................................................................................
 * 
 * ..........................................................................................11111...1111...11..11..111111...1111...111111..11..11..111111..11111..
 * 
 * .........................................................................................111111..111111..11..11..111111..111111..111111..11..11..111111..111111.
 * 
 * .........................................................................................11......11..11..111.11....11....11..11....11....111.11..11......11..11.
 * 
 * ....1....................................................................................11......11..11..111.11....11....11..11....11....111.11..11......11..11.
 * 
 * .........................................................................................11......11..11..111111....11....111111....11....111111..1111....111111.
 * 
 * .........................................................................................11......11..11..111111....11....111111....11....111111..1111....11111..
 * 
 * .........................................................................................11......11..11..11.111....11....11..11....11....11.111..11......11..11.
 * 
 * .........................................................................................11......11..11..11.111....11....11..11....11....11.111..11......11..11.
 * 
 * .........................................................................................111111..111111..11..11....11....11..11..111111..11..11..111111..11..11.
 * 
 * ..........................................................................................11111...1111...11..11....11....11..11..111111..11..11..111111..11..11.
 * 
 * `
 */
let ListSaves: number[] = []
let textSprite3: TextSprite = null
let Cutscene: Sprite = null
let ShopItem: Sprite = null
let ShopBooth: Sprite = null
let SubBossB: Sprite = null
let DroppedItem: Sprite = null
let textSprite2: TextSprite = null
let text_list = 0
let Coin: Sprite = null
let SubBoss: Sprite = null
let CameraAnchor: Sprite = null
let Module: Sprite = null
let Epilogue: Sprite = null
let Rung: Sprite = null
let Flood: Sprite = null
let textSprite: TextSprite = null
let Enemy1: Sprite = null
let ListMod: number[] = []
let Attack: Sprite = null
let EnemProj: Sprite = null
let Boss: Sprite = null
let ListEffects: number[] = []
let ListItems: Image[] = []
let ListDurability: number[] = []
let ListWeapons: Image[] = []
let ListNamePlates: Image[][] = []
let NamePlate: Sprite = null
let Weapon: Sprite = null
let DuraText: TextSprite = null
let MoneyText: TextSprite = null
let ManaBar: Sprite = null
let HpBar: Sprite = null
let Cursor: Sprite = null
let CameraSpr: Sprite = null
let mySprite: Sprite = null
let Button: Sprite = null
let Decoration: Sprite = null
let ListStorage: number[] = []
THETA()
// 0: Intermission?
// 1: Floor
// 2: Sector
// 3: ChestsLooted
// 4: EnemiesKilled
// 5: Time
// 6: Accuracy[P]
// 7: Accuracy[H]
// 8: EnemiesLeft
// 9: StoredRando
// 10: Simplif
// 11: Wave
// 12: Money
// 13: PlayerCol
// 14: PlayerRow
// 15: EnemKillSwitch
// 16: Rando 2/3
// 17: Rando 5/6
// 18: Spire
// 19:ManaCoolDown
// 20: Inventory?
// 21: WeaponAI
// 22: WeaponBI
ListStorage = [
-1,
1,
1,
0,
0,
0,
0,
0,
0,
1,
0,
1,
0,
4,
4,
9,
randint(2, 3),
randint(5, 6),
1,
40,
0,
randint(-2, 3),
randint(2, 3)
]
Decoration = sprites.create(assets.image`SoulSpire`, SpriteKind.Decor)
Button = sprites.create(assets.image`NewGame`, SpriteKind.PressStation)
Button.setPosition(125, 110)
if (blockSettings.exists("Save")) {
    Button = sprites.create(assets.image`Continue`, SpriteKind.PressStation)
    Button.setPosition(125, 91)
}
pause(500)
pauseUntil(() => browserEvents.N.isPressed() || browserEvents.C.isPressed() && blockSettings.exists("Save"))
if (browserEvents.N.isPressed()) {
    blockSettings.remove("Save")
}
color.FadeToBlack.startScreenEffect(1500)
pause(1600)
sprites.destroy(Decoration)
sprites.destroyAllSpritesOfKind(SpriteKind.PressStation)
ListStorage[0] = 0
if (blockSettings.exists("Save")) {
    ListStorage[2] = blockSettings.readNumberArray("Save")[6] + 1
    ListStorage[16] = blockSettings.readNumberArray("Save")[8]
    ListStorage[17] = blockSettings.readNumberArray("Save")[9]
    SectorSaver(ListStorage[2], true)
} else {
    tiles.setCurrentTilemap(tilemap`TowerA1`)
    color.setPalette(
    color.originalPalette
    )
}
if (!(blockSettings.exists("MaxSector"))) {
    blockSettings.writeNumber("MaxSector", 1)
}
let Semisol = sprites.create(assets.image`IsolGround`, SpriteKind.Decor)
Semisol.setFlag(SpriteFlag.Invisible, true)
Semisol.setFlag(SpriteFlag.GhostThroughWalls, true)
mySprite = sprites.create(assets.image`Isol`, SpriteKind.Player)
XChamberNum()
sprites.setDataBoolean(mySprite, "Mark", false)
sprites.setDataBoolean(mySprite, "MetaAct?", true)
sprites.setDataBoolean(mySprite, "CanDash?", true)
sprites.setDataBoolean(mySprite, "Reloaded?", true)
mySprite.ay = 500
mySprite.z = 1
sprites.setDataString(mySprite, "State", "Idle")
sprites.setDataNumber(mySprite, "HP", 100)
sprites.setDataNumber(mySprite, "Mana", 100)
if (ListStorage[21] <= 1) {
    ListStorage[21] = 1
    ListStorage[22] = ListStorage[22]
} else {
    ListStorage[21] = ListStorage[21]
    ListStorage[22] = ListStorage[21] * -1 + 5
}
sprites.setDataNumber(mySprite, "WeaponASlot", ListStorage[21])
sprites.setDataNumber(mySprite, "WeaponBSlot", ListStorage[22])
sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponASlot"))
CameraSpr = sprites.create(assets.image`Camma`, SpriteKind.Camman)
tiles.placeOnTile(CameraSpr, tiles.getTileLocation(9, 4))
scene.cameraFollowSprite(CameraSpr)
CameraSpr.setFlag(SpriteFlag.GhostThroughWalls, true)
CameraSpr.setFlag(SpriteFlag.Invisible, true)
sprites.setDataNumber(CameraSpr, "Ident", 1)
Cursor = sprites.create(assets.image`Curser`, SpriteKind.Curso)
Cursor.setFlag(SpriteFlag.GhostThroughWalls, true)
Cursor.setFlag(SpriteFlag.Invisible, true)
Cursor.z = 999
HpBar = sprites.create(assets.image`HPBarr`, SpriteKind.Barr)
HpBar.setFlag(SpriteFlag.RelativeToCamera, true)
HpBar.setFlag(SpriteFlag.Ghost, true)
HpBar.z = 998
ManaBar = sprites.create(assets.image`ManaBarr`, SpriteKind.Barr)
ManaBar.setFlag(SpriteFlag.RelativeToCamera, true)
ManaBar.setFlag(SpriteFlag.Ghost, true)
ManaBar.z = 997
scroller.setLayerImage(scroller.BackgroundLayer.Layer1, assets.image`Back2`)
scroller.scrollBackgroundWithSpeed(-40, 140, scroller.BackgroundLayer.Layer1)
scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`Back3`)
scroller.scrollBackgroundWithSpeed(-20, 70, scroller.BackgroundLayer.Layer0)
scroller.setLayerZIndex(scroller.BackgroundLayer.Layer4, 995)
scroller.setLayerZIndex(scroller.BackgroundLayer.Layer3, 500)
MoneyText = textsprite.create("0", 0, 1)
MoneyText.setPosition(2, 8)
MoneyText.setFlag(SpriteFlag.RelativeToCamera, true)
MoneyText.setFlag(SpriteFlag.Invisible, true)
MoneyText.z = 999
MoneyText.setIcon(assets.image`Opal`)
DuraText = textsprite.create("", 0, 13)
DuraText.setFlag(SpriteFlag.Invisible, true)
DuraText.z = 999
// 1. Stick
// 2. Nurf Gun
// 3. Staff
// 4. Whip
// 5. Laser
// 6. Bayonet
// 7. Lobber
// 8. Scepter
// 9. Torch
// 10. Shotgun
// 11. Dagger
// 12. Soul Sword
// 13. Cinder Block
// 14. The Pulse
// 15. Sword
// 16. Blue Lobster
// 17. Orbital
// 18. Sickle
// 19. 51-Cal
// 20. Gigantic Sword
// 21. Tome of Glyphs
// 22. Minesweeper Flag
// 23. Mouse Cursor
// 24. Landmine
// 
// Bananarang
// Nuke
// Molotov
// Shureichen
// Glass of Juice
// Sledgehammer
Weapon = sprites.create(assets.image`Weapon1`, SpriteKind.Food)
Weapon.z = 2
Weapon.setFlag(SpriteFlag.Ghost, true)
sprites.setDataNumber(Weapon, "WeaponADura", 601000000)
sprites.setDataNumber(Weapon, "WeaponBDura", 601000000)
NamePlate = sprites.create(assets.image`EmptyPlate`, SpriteKind.Plate)
NamePlate.setPosition(80, 12)
NamePlate.setFlag(SpriteFlag.Ghost, true)
NamePlate.setFlag(SpriteFlag.Invisible, true)
NamePlate.setFlag(SpriteFlag.RelativeToCamera, true)
NamePlate.z = 996
ListNamePlates = [[
assets.image`PlateW1`,
assets.image`PlateW2`,
assets.image`PlateW3`,
assets.image`PlateW4`,
assets.image`PlateW5`,
assets.image`PlateW6`,
assets.image`PlateW7`,
assets.image`PlateW8`,
assets.image`PlateW9`,
assets.image`PlateW10`,
assets.image`PlateW11`,
assets.image`PlateW12`,
assets.image`PlateW13`,
assets.image`PlateW14`,
assets.image`PlateW15`,
assets.image`PlateW16`,
assets.image`PlateW17`,
assets.image`PlateW18`,
assets.image`PlateW19`,
assets.image`PlateW20`,
assets.image`PlateW21`,
assets.image`PlateW22`,
assets.image`PlateW23`,
assets.image`PlateW24`
], [
assets.image`PlateI1`,
assets.image`PlateI2`,
assets.image`PlateI3`,
assets.image`PlateI4`,
assets.image`PlateI5`,
assets.image`PlateI6`,
assets.image`PlateI7`,
assets.image`PlateI8`,
assets.image`PlateI9`,
assets.image`PlateI10`,
assets.image`PlateI11`,
assets.image`PlateI12`,
assets.image`PlateI13`,
assets.image`PlateI14`,
assets.image`PlateI15`,
assets.image`PlateI16`
]]
ListWeapons = [
assets.image`Weapon1`,
assets.image`Weapon2`,
assets.image`Weapon3`,
assets.image`Weapon4`,
assets.image`Weapon5`,
assets.image`Weapon6`,
assets.image`Weapon7`,
assets.image`Weapon8`,
assets.image`Weapon9`,
assets.image`Weapon10`,
assets.image`Weapon11`,
assets.image`Weapon12`,
assets.image`Weapon13`,
assets.image`Weapon14`,
assets.image`Weapon15`,
assets.image`Weapon16`,
assets.image`Weapon17`,
assets.image`Weapon18`,
assets.image`Weapon19`,
assets.image`Weapon20`,
assets.image`Weapon21`,
assets.image`Weapon22`,
assets.image`Weapon23`,
assets.image`Weapon24`
]
ListDurability = [
0,
32767,
32767,
32767,
150,
500,
200,
125,
25,
90,
350,
400,
180,
50,
75,
150,
200,
125,
200,
60,
100,
300,
125,
250,
70
]
ListItems = [
assets.image`Item1`,
assets.image`Item2`,
assets.image`Item3`,
assets.image`Item4`,
assets.image`Item5`,
assets.image`Item6`,
assets.image`Item7`,
assets.image`Item8`,
assets.image`Item9`,
assets.image`Item10`,
assets.image`Item11`,
assets.image`Item12`,
assets.image`Item13`,
assets.image`Item14`,
assets.image`Item15`,
assets.image`Item16`
]
ListEffects = []
for (let index = 0; index < ListItems.length; index++) {
    ListEffects.push(1)
}
WeaponHoldImgs(ListWeapons, "Weapon", Weapon, mySprite)
if (blockSettings.exists("Save")) {
    ListStorage[12] = blockSettings.readNumberArray("Save")[7]
    ListStorage[1] = 1
    ListStorage[18] = blockSettings.readNumberArray("Save")[10]
    ListStorage[21] = blockSettings.readNumberArray("Save")[11]
    ListStorage[22] = blockSettings.readNumberArray("Save")[12]
    MoneyText.setText(convertToText(blockSettings.readNumberArray("Save")[7]))
    sprites.setDataNumber(mySprite, "HP", blockSettings.readNumberArray("Save")[0])
    sprites.setDataNumber(mySprite, "WeaponASlot", blockSettings.readNumberArray("Save")[1])
    sprites.setDataNumber(mySprite, "Weapon", sprites.readDataNumber(mySprite, "WeaponASlot"))
    sprites.setDataNumber(mySprite, "WeaponBSlot", blockSettings.readNumberArray("Save")[3])
    sprites.setDataNumber(Weapon, "WeaponADura", blockSettings.readNumberArray("Save")[2])
    sprites.setDataNumber(Weapon, "WeaponBDura", blockSettings.readNumberArray("Save")[4])
    for (let index = 0; index <= 15; index++) {
        ListEffects[index] = blockSettings.readNumberArray("Save")[13 + index]
    }
    tiles.placeOnRandomTile(CameraSpr, assets.tile`BackBrick0`)
}
EnemySpawn()
ModShuffle(6, 7)
forever(function () {
    if (mySprite.vy >= 0 && (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick74`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick72`)) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick5`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor4`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick35`)))) {
        mySprite.vy = 0
        mySprite.y = mySprite.tilemapLocation().y
    }
})
game.onUpdateInterval(50, function () {
    if (ListStorage[19] == 40) {
        if (sprites.readDataNumber(mySprite, "Mana") < 100) {
            sprites.changeDataNumberBy(mySprite, "Mana", 1)
        }
    } else {
        ListStorage[19] = ListStorage[19] + 1
    }
})
game.onUpdateInterval(randint(1600, 7000), function () {
    if (ListStorage[0] == 0) {
        Decoration = sprites.create(image.create(16, 120), SpriteKind.Decor)
        Decoration.setFlag(SpriteFlag.RelativeToCamera, true)
        Decoration.x = randint(0, 160)
        Decoration.z = -900
        Decoration.lifespan = 300
        if (Math.percentChance(33) && (sprites.readDataNumber(mySprite, "HP") > 25 && !(ListMod[ListStorage[1] - 2] == -1 && ListStorage[2] == ListStorage[17] * -1 + 11) && sprites.readDataNumber(mySprite, "HP") != 1000)) {
            animation.runImageAnimation(
            Decoration,
            assets.animation`LightningA`,
            100,
            false
            )
            if (mySprite.tilemapLocation().row >= 15) {
                color.setColor(8, color.parseColorString("#0032b3"), 100)
                timer.after(500, function () {
                    color.setColor(8, color.parseColorString("#002b75"), 1000)
                })
            }
        } else {
            animation.runImageAnimation(
            Decoration,
            assets.animation`LightningB`,
            100,
            false
            )
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (ListStorage[0] == 0) {
        ListStorage[5] = ListStorage[5] + 1
    }
})
forever(function () {
    if (sprites.readDataNumber(CameraSpr, "Ident") == 2) {
        CameraAnchor.setPosition((mySprite.x + Boss.x) / 2, (mySprite.y + Boss.y) / 2)
        CameraSpr.follow(CameraAnchor, (Math.abs(CameraAnchor.x - scene.cameraProperty(CameraProperty.X)) + Math.abs(CameraAnchor.y - scene.cameraProperty(CameraProperty.Y))) * 2 + 20)
    } else if (sprites.readDataNumber(CameraSpr, "Ident") == 3) {
        CameraSpr.follow(Boss, (Math.abs(Boss.x - scene.cameraProperty(CameraProperty.X)) + Math.abs(Boss.y - scene.cameraProperty(CameraProperty.Y))) * 2 + 20)
    } else if (sprites.readDataNumber(CameraSpr, "Ident") == 4) {
        CameraSpr.follow(ShopBooth, (Math.abs(ShopBooth.x - scene.cameraProperty(CameraProperty.X)) + Math.abs(ShopBooth.y - scene.cameraProperty(CameraProperty.Y))) * 2 + 20)
    } else if (sprites.readDataNumber(CameraSpr, "Ident") == 5) {
        CameraSpr.follow(mySprite, 0)
    } else {
        CameraSpr.follow(mySprite, (Math.abs(mySprite.x - scene.cameraProperty(CameraProperty.X)) + Math.abs(mySprite.y - scene.cameraProperty(CameraProperty.Y))) * 2 + 20)
    }
    if (ListStorage[2] == 7) {
        if (ListMod[ListStorage[1] - 2] == -1 && sprites.readDataBoolean(Boss, "Reloaded?")) {
            Boss.setPosition(scene.cameraProperty(CameraProperty.X) + sprites.readDataNumber(Boss, "X"), scene.cameraProperty(CameraProperty.Y) + sprites.readDataNumber(Boss, "Y"))
        }
    }
    for (let value of sprites.allOfKind(SpriteKind.FollowDecorX)) {
        value.x = scene.cameraProperty(CameraProperty.X) + sprites.readDataNumber(value, "Ident")
    }
    Weapon.setPosition(mySprite.x, mySprite.y)
    Semisol.setPosition(mySprite.x, mySprite.y + 11)
    DuraText.right = scene.cameraProperty(CameraProperty.Right) - 2
    DuraText.top = scene.cameraProperty(CameraProperty.Top) + 4
    Cursor.setPosition(sprites.readDataNumber(Cursor, "X") + scene.cameraProperty(CameraProperty.Left), sprites.readDataNumber(Cursor, "Y") + scene.cameraProperty(CameraProperty.Top))
    Flood.x = mySprite.x
    if (ListStorage[0] == 0) {
        HpBar.left = sprites.readDataNumber(mySprite, "HP") * (1.6 / ListEffects[5]) - 160
        ManaBar.left = sprites.readDataNumber(mySprite, "Mana") * 1.6 - 160
    } else {
        scroller.setBackgroundScrollOffset(160, 0, scroller.BackgroundLayer.Layer4)
    }
    if (sprites.readDataBoolean(mySprite, "Melee?")) {
        Attack.setPosition(mySprite.x, mySprite.y)
    }
    if (sprites.readDataBoolean(mySprite, "CanMove?") && sprites.readDataBoolean(mySprite, "MetaAct?")) {
        if (controller.right.isPressed()) {
            if (sprites.readDataString(mySprite, "State") != "WalkRE" && mySprite.vy == 0) {
                sprites.setDataString(mySprite, "State", "WalkR")
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolWalkRight`,
                100,
                true
                )
                sprites.setDataString(mySprite, "State", "WalkRE")
            }
            if (mySprite.vx < 80 * ListEffects[9]) {
                mySprite.vx += 10
            }
        } else if (controller.left.isPressed()) {
            if (sprites.readDataString(mySprite, "State") != "WalkLE" && mySprite.vy == 0) {
                sprites.setDataString(mySprite, "State", "WalkL")
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolWalkLeft`,
                100,
                true
                )
                sprites.setDataString(mySprite, "State", "WalkLE")
            }
            if (mySprite.vx > -80 * ListEffects[9]) {
                mySprite.vx += -10
            }
        } else {
            if (mySprite.vx < 0) {
                if (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor5`)) {
                    mySprite.vx += 1
                } else {
                    mySprite.vx += 10
                }
            } else if (mySprite.vx > 0) {
                if (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor5`)) {
                    mySprite.vx += -1
                } else {
                    mySprite.vx += -10
                }
            } else {
                if (sprites.readDataString(mySprite, "State") != "IdleE") {
                    sprites.setDataString(mySprite, "State", "Idle")
                }
                if (sprites.readDataString(mySprite, "State") == "Idle" && mySprite.vy == 0) {
                    if (sprites.readDataNumber(mySprite, "FacingLeft?") == 1) {
                        animation.runImageAnimation(
                        mySprite,
                        assets.animation`IsolIdleLeft`,
                        200,
                        true
                        )
                    } else {
                        animation.runImageAnimation(
                        mySprite,
                        assets.animation`IsolIdleRight`,
                        200,
                        true
                        )
                    }
                    sprites.setDataString(mySprite, "State", "IdleE")
                }
            }
        }
    }
})
forever(function () {
    if (mySprite.isHittingTile(CollisionDirection.Bottom) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor0`) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor2`) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick74`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick72`))) || (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick5`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`Floor4`) || mySprite.tileKindAt(TileDirection.Bottom, assets.tile`BackBrick35`)))) {
        ListStorage[13] = mySprite.tilemapLocation().column
        ListStorage[14] = mySprite.tilemapLocation().row
        if ((controller.up.isPressed() || browserEvents.Space.isPressed()) && (sprites.readDataBoolean(mySprite, "CanMove?") && sprites.readDataBoolean(mySprite, "MetaAct?"))) {
            if (sprites.readDataNumber(mySprite, "FacingLeft?") == 0) {
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolJumpRight`,
                200,
                true
                )
            } else {
                animation.runImageAnimation(
                mySprite,
                assets.animation`IsolJumpLeft`,
                200,
                true
                )
            }
            sprites.setDataString(mySprite, "State", "Jump")
            mySprite.vy = -225
            timer.after(100, function () {
                if (!(controller.up.isPressed() || browserEvents.Space.isPressed())) {
                    mySprite.vy = -50
                } else {
                    timer.after(50, function () {
                        if (!(controller.up.isPressed() || browserEvents.Space.isPressed())) {
                            mySprite.vy = -50
                        }
                    })
                }
            })
            pauseUntil(() => !(controller.up.isPressed() || browserEvents.Space.isPressed()))
        }
    }
})

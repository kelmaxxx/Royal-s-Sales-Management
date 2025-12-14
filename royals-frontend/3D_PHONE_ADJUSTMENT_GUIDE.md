# 3D Phone Model Adjustment Guide

## 📍 Location in Code
**File:** `royals-frontend/src/components/Phone3DModel.jsx`  
**Line:** Around **Line 67** in the `PhoneModel` component

## 🎯 How to Adjust Position & Rotation

### Current Code (Line 65-69):
```jsx
return (
  <group ref={group} position={[0, 0, 0]} rotation={[0.2, 0.3, 0]}>
    <primitive object={scene} scale={3.5} />
  </group>
);
```

---

## 🔧 Adjustment Parameters

### 1. **Position** - `position={[x, y, z]}`
Controls where the phone appears in 3D space.

```jsx
position={[x, y, z]}
```

- **`x`** → Left/Right
  - Negative values (-1, -2) = Move LEFT
  - Positive values (1, 2) = Move RIGHT
  - Example: `position={[1, 0, 0]}` moves phone to the right

- **`y`** → Up/Down
  - Negative values (-1, -2) = Move DOWN
  - Positive values (1, 2) = Move UP
  - Example: `position={[0, 1, 0]}` moves phone up

- **`z`** → Forward/Backward
  - Negative values (-1, -2) = Move CLOSER to camera
  - Positive values (1, 2) = Move AWAY from camera
  - Example: `position={[0, 0, -1]}` brings phone closer

**Try These:**
```jsx
position={[1, 0.5, 0]}     // Slightly right and up
position={[-0.5, -0.5, 0]} // Left and down
position={[0, 0, -1]}      // Closer to camera
```

---

### 2. **Rotation** - `rotation={[x, y, z]}`
Controls how the phone is tilted/rotated (in radians).

```jsx
rotation={[x, y, z]}
```

- **`x`** → Tilt Forward/Backward (pitch)
  - Negative values = Tilt phone screen TOWARDS you
  - Positive values = Tilt phone screen AWAY from you
  - Example: `rotation={[0.5, 0, 0]}` tilts top away

- **`y`** → Rotate Left/Right (yaw)
  - Negative values = Rotate phone LEFT
  - Positive values = Rotate phone RIGHT
  - Example: `rotation={[0, 0.5, 0]}` rotates right

- **`z`** → Roll Left/Right (roll)
  - Negative values = Roll phone counter-clockwise
  - Positive values = Roll phone clockwise
  - Example: `rotation={[0, 0, 0.3]}` rolls slightly right

**💡 Angle Conversion:**
- 90° = 1.57 radians (π/2)
- 45° = 0.785 radians (π/4)
- 30° = 0.52 radians (π/6)
- 15° = 0.26 radians (π/12)

**Try These Popular Angles:**
```jsx
rotation={[0.3, 0.5, 0]}    // Tilted back, rotated right (showcase view)
rotation={[-0.2, 0.4, 0.1]} // Slightly forward, rotated right, small roll
rotation={[0.5, -0.3, 0]}   // Tilted back, rotated left
rotation={[0, 0.8, 0]}      // Flat tilt, big rotation (side view)
rotation={[0.2, 0, 0.2]}    // Slight tilt, slight roll (dynamic look)
```

---

### 3. **Scale** - `scale={number}`
Controls the size of the phone.

```jsx
<primitive object={scene} scale={3.5} />
```

- Current: `3.5`
- Smaller: `2.5`, `3.0`
- Larger: `4.0`, `4.5`, `5.0`

---

## 🎨 Recommended Presets

### **Preset 1: Classic Showcase (Current)**
```jsx
<group ref={group} position={[0, 0, 0]} rotation={[0.2, 0.3, 0]}>
  <primitive object={scene} scale={3.5} />
</group>
```

### **Preset 2: Dramatic Tilt**
```jsx
<group ref={group} position={[0, 0, 0]} rotation={[0.4, 0.6, 0.1]}>
  <primitive object={scene} scale={3.5} />
</group>
```

### **Preset 3: Side Profile**
```jsx
<group ref={group} position={[-0.5, 0, 0]} rotation={[0.2, 0.8, 0]}>
  <primitive object={scene} scale={3.5} />
</group>
```

### **Preset 4: Front Facing**
```jsx
<group ref={group} position={[0, 0, -0.5]} rotation={[0.1, 0, 0]}>
  <primitive object={scene} scale={4.0} />
</group>
```

### **Preset 5: Dynamic Roll**
```jsx
<group ref={group} position={[0.3, 0.2, 0]} rotation={[0.3, 0.4, 0.3]}>
  <primitive object={scene} scale={3.5} />
</group>
```

---

## 🎮 How to Test Your Changes

1. **Save the file** after making changes
2. The browser should **auto-reload** (Vite hot reload)
3. Scroll to the **Sales & Product section**
4. Observe the phone position/rotation
5. Adjust values and repeat

---

## 🧪 Interactive Testing Mode

To see real-time changes, you can temporarily add orbit controls:

**Line 157** - Uncomment or add:
```jsx
<OrbitControls enableZoom={true} />
```

This lets you:
- **Click & Drag** = Rotate view
- **Right Click & Drag** = Pan camera
- **Scroll** = Zoom in/out

Use this to find your perfect angle, then note the values!

---

## 📊 Visual Reference

```
         Y (up)
         |
         |
         |________ X (right)
        /
       /
      Z (towards you)

Rotation Axes:
- X rotation = Pitch (tilt forward/back)
- Y rotation = Yaw (spin left/right)
- Z rotation = Roll (tilt sides)
```

---

## 🎯 Quick Tips

1. **Small values** (0.1-0.5) = Subtle, professional look
2. **Medium values** (0.5-1.0) = Noticeable, dynamic look
3. **Large values** (1.0+) = Dramatic, artistic look

4. **Combine rotations** for interesting angles:
   - `rotation={[0.3, 0.5, 0.1]}` = Natural showcase angle
   - `rotation={[0, 0.785, 0]}` = Perfect 45° side view

5. **Match with position** for best results:
   - Rotating right (`y > 0`)? Move left (`x < 0`) to center
   - Tilting back (`x > 0`)? Move up (`y > 0`) to fill space

---

## 🔄 Current Animation Effects

The phone also has scroll-based animations defined in **Lines 26-63**:

- **Scroll tilt** (Line 33): `scrollProgress * Math.PI * 0.3`
- **Scroll rotate** (Line 34): `scrollProgress * Math.PI * 0.2`
- **Floating** (Line 62): Gentle up/down motion

These add to your base rotation/position values!

---

## 💾 Save Your Favorite Settings

Once you find a position/rotation you like, document it here:

**My Settings:**
```jsx
position={[___, ___, ___]}
rotation={[___, ___, ___]}
scale={___}
```

---

## Need Help?

Ask me to apply any of these presets or create a custom angle for you!

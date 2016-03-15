#ife solution
1.ifc中图像是与父元素基线对齐的,而父元素的基线位于父元素底部3像素，因此图像的父元素会多出3px的高度。
solution：(1)给父元素加font-size:0;
           (2)给图像加vertical-align:bottom;


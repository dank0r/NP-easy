#include <iostream>
#include <fstream>

using namespace std;
const int nm=1000;


double a[nm][nm];
double buf [nm][nm];
int n;

void makebase(int ik, int jk)
{
 int i,j;
 for (i=0;i<n;i++) if (a[i][jk]>=0) a[i][jk]=-1;
 for (j=0;j<n;j++) if (a[ik][j]>=0) a[ik][j]=-1;
 a[ik][jk]=-2;
 if (a[jk][ik]>=0) a[jk][ik]=-1;
}

int main()
{
    ifstream f("/root/input"); /*ifstream f("input.txt");*/
 ofstream out("/root/output"); /*ofstream out("output.txt");*/
 int i,j,c,i2,j2,i3,j3;
 int cnt;
 double minv, miniv, minjv, maxv;
 int flag;

 f >> n;
 for (i=0;i<n;i++) for (j=0;j<n;j++) f >> a[i][j];
 f.close();
 for (i=0;i<n;i++) a[i][i]=-1;
 for (c=0;c<n;c++)
 {
  // looking for one-in-row or one-in-col element
  flag=0;
  for (i=0;(i<n)&&(flag==0);i++)
  {
   cnt=0;
   for (j=0;j<n;j++) if (a[i][j]>=0)
   {
    i2=i;
    j2=j;
    cnt++;
   }
   if (cnt==1) flag=1;
  }
  for (j=0;(j<n)&&(flag==0);j++)
  {
   cnt=0;
   for (i=0;i<n;i++) if (a[i][j]>=0)
   {
    i2=i;
    j2=j;
    cnt++;
   }
   if (cnt==1) flag=1;
  }
  if (flag==1)
  {
   makebase(i2,j2);
   continue;
  }

  // minus mins
  for (i=0;i<n;i++)
  {
   minv=30000;
   for (j=0;j<n;j++)
    if ((a[i][j]>=0)&&(a[i][j]<minv)) minv=a[i][j];
   for (j=0;j<n;j++) if(a[i][j]>=0) a[i][j]-=minv;
  }
  for (j=0;j<n;j++)
  {
   minv=30000;
   for (i=0;i<n;i++)
    if ((a[i][j]>=0)&&(a[i][j]<minv)) minv=a[i][j];
   for (i=0;i<n;i++) if(a[i][j]>=0) a[i][j]-=minv;
  }

  // checking nulls and looking for base values

  maxv=-1;
  for (i=0;i<n;i++) for (j=0;j<n;j++) if (a[i][j]==0)
  {
   miniv=30000;
   minjv=30000;
   for (i2=0;i2<n;i2++) if ((a[i2][j]>=0)&&(i2!=i)&&(a[i2][j]<miniv)) miniv=a[i2][j];
   for (j2=0;j2<n;j2++) if ((a[i][j2]>=0)&&(j2!=j)&&(a[i][j2]<minjv)) minjv=a[i][j2];
   if (miniv+minjv>maxv)
   {
    maxv=miniv+minjv;
    i3=i;
    j3=j;
   }
  }

  makebase(i3,j3);
 }

 // output

 i2=0;
 out << i2+1;
 for (c=0;c<n;c++)
 {
  for (j=0;j<n;j++) if (a[i2][j]==-2)
  {
   out << " " << j+1;
   i2=j;
   break;
  }
 }
return 0;
}

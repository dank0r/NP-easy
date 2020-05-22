
	
#include<iostream>
#include <fstream>
#include <ctime>
using namespace std;
     unsigned int start_time; // начальное время
    // здесь должен быть фрагмент кода, время выполнения которого нужно измерить
double ary[1000][1000],completed[1000],cost=0.0;
int n;
 
void takeInput()
{
	int i,j;
 
	ifstream cin("input.txt");
	ofstream cout("output.txt");
	cin>>n;
 

 
	for(i=0;i < n;i++)
	{
		
 		completed[i]=0;
		for( j=0;j < n;j++)
			cin>>ary[i][j];
 
		
	}
 
	
 
	for( i=0;i < n;i++)
	{
		cout<<"\n";
 
		for(j=0;j < n;j++)
			cout<<"\t"<<ary[i][j];
	}
}
 
int least(int c)
{
	int i,nc=999000;
	int min=999000,kmin;
 
	for(i=0;i < n;i++)
	{
		if((ary[c][i]!=0)&&(completed[i]==0))
			if(ary[c][i]+ary[i][c] < min)
			{
				min=ary[i][0]+ary[c][i];
				kmin=ary[c][i];
				nc=i;
			}
	}
 
	if(min!=999000)
		cost+=kmin;
 
	return nc;
}
 
void mincost(int city)
{
	int i,ncity;
 
	completed[city]=1;
 
	cout<<city+1<<"-->";
	ncity=least(city);
 
	if(ncity==999000)
	{
		ncity=0;
		cout<<ncity+1;
		cost+=ary[city][ncity];
 
		return;
	}
 
	mincost(ncity);
}
 
int main()
{
		start_time =  clock(); 
	takeInput();
 
//	cout<<"\n\nThe Path is:\n";
	mincost(0); //passing 0 because starting vertex
 
	cout<<"\n\nMinimum cost is "<<cost;
  unsigned int end_time = clock(); // конечное время
    unsigned int search_time = end_time - start_time; // искомое время
    
        cout<<endl;
    cout<< search_time<<endl;
 
	return 0;
}

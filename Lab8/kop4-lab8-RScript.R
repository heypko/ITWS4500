# Load igraph
library(igraph)

# Load necessary csv files into nodes/edges
nodes <- read.csv("~/Desktop/websci/Lab8/boston/airBostonNodes10.csv", header=T, as.is=T)
edges <- read.csv("~/Desktop/websci/Lab8/boston/reviews10.csv", header=T, as.is=T)

# Connect nodes through edges
nrow(edges); nrow(unique(edges[,c("listing_id", "review_id")]))
edges <- edges[order(edges$listing_id, edges$review_id),]

# Create graph
colnames(edges[5]) <- "weight"
rownames(edges) <- NULL
net <- graph_from_data_frame(d=edges, vertices=nodes, directed=F) 

# Plot graph
plot(net, edge.arrow.size=.4,vertex.label=NA)

# Change node colors
V(net)$color <- ifelse(V(net)$host_acceptance_rate > 90, "green", 
                       ifelse(V(net)$host_acceptance_rate > 70, "gold", 
                              ifelse(V(net)$host_acceptance_rate > 0, "red", "lightblue")))

# Set node size based on audience size:
#V(net)$size <- ifelse(V(net)$host_listings_count, V(net)$host_listings_count*1, 5)
V(net)$size <-ifelse(!is.na(V(net)$accommodates), V(net)$accommodates*10, 5)

V(net)$size <- V(net)$size * .8

#Set edge width to small
E(net)$arrow.size <- .2

# Plot Graph
plot(net, vertex.label=V(net)$price, layout = cl,vertex.label=NA)

# Create legend
legend(x=-1.5, y=-1.1, c("<70% Acceptance",">90% Acceptance", ">70% Acceptance"), pch=21,
       col="#777777", pt.bg=colrs, pt.cex=2, cex=.8, bty="n", ncol=1)

